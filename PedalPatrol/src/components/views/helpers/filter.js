import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

/**
 * Class to display the filter items list
 */ 
class FilterHelper extends Component {
	icon = () => (
		<Icon name="filter-list" type="MaterialIcons" size={30} color="#01a699" />
	);

	render() {
		return (
		  	<View>
				<SectionedMultiSelect
					items={items} 
					uniqueKey='id'
					subKey='children'
					iconKey='icon'
					selectText=''
					modalWithSafeAreaView={true}
					showDropDowns={true}
					readOnlyHeadings={true}
					selectToggleIconComponent={<Icon name="filter-list" type="MaterialIcons" size={30} color="#01a699" />}
					onSelectedItemsChange={this.props.onSelectedItemsChange}
					selectedItems={this.props.selectedItems}
				/>
	 
		  	</View>
		);
	}
}

export default FilterHelper;

const items = [
  {  
	name: "Colours",
	id: 0,
	icon: { uri: "https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png" }, // local required file
	children: [{
		name: "Red",
		id: 10,
	  },{
		name: "Green",
		id: 11,
	  },{
		name: "Blue",
		id: 12,
	  },{
		name: "Yellow",
		id: 13,
	  },{
		name: "Purple",
		id: 14,
	  },{
		name: "Other",
		id: 15,
	  }]
  },
  {
	name: "Gems",
	id: 1,
	icon: { uri: "https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png" }, // web uri
	children: [{
		name: "Quartz",
		id: 20,
	  },{
		name: "Zircon",
		id: 21,
	  },{
		name: "Sapphire",
		id: 22,
	  },{
		name: "Topaz",
		id: 23,
	  }]
  },
];