import { forwardRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
  onPress?: TouchableOpacityProps['onPress'];
  title?: string;
  isLoading?: boolean
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ onPress, title, isLoading = false, ...otherProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        style={[styles.button, { backgroundColor: otherProps.disabled ? 'gray' : '#38C400' }]}
        onPress={onPress}
        {...otherProps}>
        <Text style={styles.buttonText}>{title}</Text>
        {isLoading && <ActivityIndicator color={'white'} style={styles.activityIndicator} />}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 24,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    right: 20,
  },
});
