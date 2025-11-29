import React, { JSX } from 'react';
import { View, Text, ScrollView, StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface ListProps<T> {
    Icon?: JSX.Element,
	Button?: JSX.Element,
	title: string,
	data: T[],
	renderItem: (item: T, index: number) => React.ReactNode,

    style?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>,
};
const List = <T extends unknown>({Icon, Button, title, data, renderItem, style, containerStyle }: ListProps<T>) => {
	return (
		<View
			style={[styles.container, style]}
		>
			<View
				style={styles.header}
			>
				<View style={{flexDirection: 'row', gap: 10}}>
					{Icon}
				<Text
					style={styles.title}
				>
					{title}
				</Text>
				</View>

				{Button}
			</View>
			<ScrollView
            contentContainerStyle={[styles.contentContainerStyle, containerStyle]}>
				{data.map((item, index) => (
					<React.Fragment key={index}>
						{renderItem(item, index)}
					</React.Fragment>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
    container: {
		width: '100%',
        				backgroundColor: '#d9d9d5',
				flexDirection: 'column',
				flex: 1,
				borderRadius: 10,
    },
    header: {	
		width: '100%',
		justifyContent: 'space-between',
					flexDirection: 'row',
					alignContent: 'space-between',
					paddingHorizontal: 20,
					paddingVertical: 20,
    },
    title: {
        						// paddingLeft: 15,
						color: '#8d8e8c',
						fontSize: 16,
						letterSpacing: -0.5,
						fontWeight: '700',
    },
	// button: {
    //     						// paddingLeft: 15,
	// 					color: '#8d8e8c',
	// 					fontSize: 16,
	// 					letterSpacing: -0.5,
	// 					fontWeight: '700',
    // },
    contentContainerStyle: {
        gap: 2
    }
});

export default List;
