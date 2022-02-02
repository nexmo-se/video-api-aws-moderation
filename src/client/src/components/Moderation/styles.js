import { makeStyles } from '@material-ui/core/styles';
export default makeStyles((theme) => ({
  moderationChip: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 99
  },
  transcriptionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  transcriptionText: {
    backgroundColor: '#871fff',
    color: '#fff',
    padding: '20px 50px',
    fontSize: 24,
    textAlign: 'center',
    borderRadius: '15px'
  }
}));
