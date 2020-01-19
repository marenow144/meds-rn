package com.reactlibrary;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.PointF;
import android.os.Environment;

import android.util.Log;
import android.view.Display;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.scanner.libraries.NativeClass;

import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

    }

    @Override
    public String getName() {
        return "RNOpenCvLibrary";
    }

    @ReactMethod
    public void initializeCropping(String imagePath, ReadableMap dimensions, Callback cb) {

        File image = new File(imagePath);

        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
        Bitmap decodedByte = BitmapFactory.decodeFile(image.getAbsolutePath(),bmOptions);
        if(decodedByte.getHeight()<decodedByte.getWidth()){
            Matrix matrix = new Matrix();
            matrix.postRotate(90);
            decodedByte =  Bitmap.createBitmap(decodedByte, 0, 0, decodedByte.getWidth(), decodedByte.getHeight(), matrix, true);
        }

        decodedByte = Bitmap.createScaledBitmap(
                 decodedByte, dimensions.getInt("width"), dimensions.getInt("height"), false);



        Map<Integer, PointF> pointFs = getEdgePoints(decodedByte);
        WritableMap promiseArray = Arguments.createMap();
        for(Map.Entry<Integer,PointF> entry: pointFs.entrySet()){
            WritableMap writableMap = new WritableNativeMap();
            writableMap.putDouble("x",entry.getValue().x);
            writableMap.putDouble("y",entry.getValue().y);
            promiseArray.putMap(entry.getKey().toString(),writableMap);
        }
        cb.invoke(promiseArray);
    }

    @ReactMethod
    public void enchanceImage(String imagePath, ReadableMap dimensions, ReadableArray corners, Callback cb){
        File image = new File(imagePath);

        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
        Bitmap decodedByte = BitmapFactory.decodeFile(image.getAbsolutePath(),bmOptions);
        if(decodedByte.getHeight()<decodedByte.getWidth()){
            Matrix matrix = new Matrix();
            matrix.postRotate(90);
            decodedByte =  Bitmap.createBitmap(decodedByte, 0, 0, decodedByte.getWidth(), decodedByte.getHeight(), matrix, true);
        }



        NativeClass nativeClass = new NativeClass();

        double scalingFactorX =(double)decodedByte.getWidth()/dimensions.getInt("width");
        double scalingFactorY =(double)decodedByte.getHeight()/dimensions.getInt("height");

        List<PointF> pointsFsFromContourArray = new ArrayList<>();

        for(int i=0;i<corners.size();i++){
            PointF pointF = new PointF();
            pointF.x = (float)corners.getMap(i).getDouble("x")*(float)scalingFactorX;
            pointF.y = (float)corners.getMap(i).getDouble("y")*(float)scalingFactorY;
            pointsFsFromContourArray.add(pointF);
        }

        Map<Integer, PointF> orderedValidEdges = getOrderedPoints(pointsFsFromContourArray);
        Bitmap transformed = nativeClass.getCroppedImage(decodedByte,orderedValidEdges);
        String filename = Math.random()+"enchanced.png";
        File sd = Environment.getExternalStorageDirectory();
        File storeDir = new File(sd, "react-native-scans");
        if(!storeDir.exists()){
            storeDir.mkdir();
        }
        File dest = new File(storeDir, filename);
        try {
            FileOutputStream out = new FileOutputStream(dest);
            transformed.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
            Log.v("marek-tag", e.getMessage());
        }
        cb.invoke(dest.toString());
    }


    private Map<Integer, PointF> getEdgePoints(Bitmap tempBitmap) {
        List<PointF> pointFs = getContourEdgePoints(tempBitmap);
        return orderedValidEdgePoints(tempBitmap, pointFs);
    }

    private List<PointF> getContourEdgePoints(Bitmap tempBitmap) {
        NativeClass nativeClass = new NativeClass();
        MatOfPoint2f point2f = nativeClass.getPoint(tempBitmap);
        List<Point> points = Arrays.asList(point2f.toArray());
        List<PointF> result = new ArrayList<>();
        for (int i = 0; i < points.size(); i++) {
            result.add(new PointF(((float) points.get(i).x), ((float) points.get(i).y)));
        }

        return result;

    }

    private Map<Integer, PointF> getOutlinePoints(Bitmap tempBitmap) {
        Map<Integer, PointF> outlinePoints = new HashMap<>();
        outlinePoints.put(0, new PointF(0, 0));
        outlinePoints.put(1, new PointF(tempBitmap.getWidth(), 0));
        outlinePoints.put(2, new PointF(0, tempBitmap.getHeight()));
        outlinePoints.put(3, new PointF(tempBitmap.getWidth(), tempBitmap.getHeight()));
        return outlinePoints;
    }
    private Map<Integer, PointF> getOrderedPoints(List<PointF> points) {

        PointF centerPoint = new PointF();
        int size = points.size();
        for (PointF pointF : points) {
            centerPoint.x += pointF.x / size;
            centerPoint.y += pointF.y / size;
        }
        Map<Integer, PointF> orderedPoints = new HashMap<>();
        for (PointF pointF : points) {
            int index = -1;
            if (pointF.x < centerPoint.x && pointF.y < centerPoint.y) {
                index = 0;
            } else if (pointF.x > centerPoint.x && pointF.y < centerPoint.y) {
                index = 1;
            } else if (pointF.x < centerPoint.x && pointF.y > centerPoint.y) {
                index = 2;
            } else if (pointF.x > centerPoint.x && pointF.y > centerPoint.y) {
                index = 3;
            }
            orderedPoints.put(index, pointF);
        }
        return orderedPoints;
    }
    private Map<Integer, PointF> orderedValidEdgePoints(Bitmap tempBitmap, List<PointF> pointFs) {
        Map<Integer, PointF> orderedPoints = getOrderedPoints(pointFs);
        if (!isValidShape(orderedPoints)) {
            orderedPoints = getOutlinePoints(tempBitmap);
        }
        return orderedPoints;
    }
    private boolean isValidShape(Map<Integer, PointF> pointFMap) {
        return pointFMap.size() == 4;
    }
}
