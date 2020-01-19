import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  imagePreview: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative'
  },
  repeatPhotoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 60,
    backgroundColor: '#000',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
  },
  focusFrameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  focusFrame: {
    height: 90,
    width: 90,
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'dotted',
    borderRadius: 5,
  },
  photoPreviewRepeatPhotoText: {
    color: '#abcfff',
    fontSize: 15,
    marginLeft: 10,
  },
  usePhotoContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: 60,
    backgroundColor: '#000',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  photoPreviewUsePhotoText: {
    color: '#abcfff',
    fontSize: 15,
    marginRight: 10,
  },
  preview: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  takePictureContainer: {
    position: 'absolute',
    paddingVertical: 20,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flex:1,
    flexDirection: 'row',
    marginTop: 25,

  },
  buttonStyle: {
    width: 140,
    height: 30,
    backgroundColor: "#00526B",
    borderRadius: 5,
    borderColor: "#000000",
    borderWidth: 0,
    marginLeft: 25,
    justifyContent: 'center',
    alignItems: 'center',

  }
});
