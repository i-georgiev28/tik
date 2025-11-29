import {
  BackButtonProps,
  HeaderProps,
} from './Header.types';
import { styles } from './Header.styles';
import { Text, View } from 'react-native';
import React from 'react';
import Button from '@/components/ui/Button';

const BackButton = ({ onPress }: BackButtonProps) => {
  return (
    <Button onPress={onPress} style={{
      marginRight: 18
    }}>{"<"}</Button>
    // <TouchableOpacity style={styles.backButton} onPress={onPress}>
    //   <Text style={styles.backButtonText}>←</Text>
    // </TouchableOpacity>
  );
};

export default function Header({
                  title,
                  showBackButton = false,
                  onBackPress,
                  children,
                  style,
                  ...props
                }: HeaderProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.leftContainer}>
        {showBackButton && <BackButton onPress={onBackPress} />}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {children}
      </View>
    </View>
  );
};

// Left subcomponent

// Attach subcomponents to Header
// Header.Left = HeaderLeft;
// Header.Right = HeaderRight;
//
// export default Header;
// import { View, Text } from 'react-native';
// import Button from '@/components/ui/Button';
//
// export default () => {
//   return (
//     <View
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: '5%',
//       }}
//     >
//       <Text
//         style={{
//           fontFamily: 'Helvetica Now Display',
//           fontWeight: '700',
//           fontSize: 42,
//           color: '#ffffff',
//           paddingLeft: '1%',
//         }}
//       >
//         ALARMS
//       </Text>
//       <Button>{"EDIT"}</Button>
//
//     </View>
//   );
// }