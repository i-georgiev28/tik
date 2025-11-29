import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

import List from '@/components/ui/List/List';

// TODO: Replace with actual Option type
interface Option {
  id: number;
  label: string;
  value: string;
}

  const options: Option[] = [
    { id: 1, label: 'Repeat', value: 'Every Day' },
    { id: 2, label: 'Sound', value: 'Dink' },
    { id: 3, label: 'Tag', value: 'TASK' },
  ];


const OptionsList = () => {
    const renderOption = (item: Option) => (
        <View style={{flex: 1, backgroundColor: '#ffffff', borderRadius: 10, height: 60, width: '100%', 
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20
        }}>
          <Text style={{fontWeight: 500, fontSize: 16}}>{item.label}</Text>
          <Text style={{fontWeight: 400, fontSize: 16}}>{item.value}</Text>
        </View>
  );
    return (
        <List
        Icon={<></>}
        title="Options"
        data={options}
        style={{
          marginTop: 40,
          maxHeight: 252
        }
        }
        renderItem={(item, index) => renderOption(item)}
        containerStyle={{ marginHorizontal: 5 }} // Additional styling if needed
      />
    );
	// return (
	// 	<View
	// 		style={{
	// 			flexDirection: 'column',
	// 			backgroundColor: '#d9d9d5',
	// 			width: '100%',
	// 			flex: 1,
	// 			borderRadius: 16,
    //             maxHeight: 250,
	// 		}}
	// 	>
	// 		<View
	// 			style={{
	// 				flexDirection: 'row',
	// 				paddingHorizontal: 10,
	// 				paddingVertical: 20,
	// 			}}
	// 		>
	// 			<Text
	// 				style={{
	// 					paddingLeft: 15, //TODO: Add icon
	// 					color: '#8d8e8c',
	// 					fontSize: 16,
	// 					letterSpacing: -0.5,
	// 					fontWeight: '700',
	// 				}}
	// 			>
	// 				OPTIONS
	// 			</Text>
	// 		</View>
    //               <ScrollView style={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     // width: '100%',
    //     flex: 1,
    //     marginHorizontal: 5,
    //     marginBottom: 5,
    //     gap: 2
    //   }}
    //   contentContainerStyle={{
    //     gap: 4
    //   }}>
    //       <View style={{flex: 1, backgroundColor: '#ffffff', borderRadius: 16, height: 60, width: '100%'}}>
    //         {/*<Text>Hi</Text>*/}
    //       </View>
    //     <View style={{flex: 1, backgroundColor: '#ffffff', borderRadius: 16, height: 60, width: '100%'}}>
    //       {/*<Text>Hi</Text>*/}
    //     </View>
    //     <View style={{flex: 1, backgroundColor: '#ffffff', borderRadius: 16, height: 60, width: '100%'}}>
    //       {/*<Text>Hi</Text>*/}
    //     </View>
    //   </ScrollView>
	// 	</View>
	// );
};

export default OptionsList;
