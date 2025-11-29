import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  title: {
    fontFamily: 'Helvetica Now Display',
    fontWeight: '700',
    fontSize: 48,
    color: '#ffffff',
    paddingLeft: '1%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  // backButton: {
  //   padding: 8,
  //   marginRight: 12,
  // },
  // backButtonText: {
  //   color: '#ffffff',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },
});