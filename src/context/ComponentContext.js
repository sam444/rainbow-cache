import {ArrayUtil} from 'rainbow-foundation-tools';
/**
 * ComponentContext is a page level storge component cache. Once url changed the cache must be clear.
 * @module ComponentContext
 */
module.exports = {
	
  	data: Object.create(null),
	
	put: function(key, value){
		this.data[key] = value;
	},
	
	get: function(key){
		return this.data[key];
	},
	
	remove: function(key){
		delete this.data[key];
	},
	
	clear: function(key){
		this.data = Object.create(null);
	},
	
	list: function(){
		return this.data;
	},
	
	/**
	* Get a rainbow component by component id. return a component array.
	* @param  {array} componentIds - diffent id should used ',' to split.
	* @example 
	* import {ComponentContext} from 'rainbow-foundation-cache'
	* const component  = ComponentContext.getComponent(['workListId','inputIds']);
	*/
	getComponent: function(componentId){
		let componentIdArray = ArrayUtil.trimArray(componentId.split(","));
		let _self = this, componentArray = [];
		
		$.each(componentIdArray, function(index, element){
			let component = _self.data[element];
			if(component != undefined){
				componentArray.push(component);
			}
		});
		
		return componentArray;
	},
	
	
	/**
	* Force flash component by component id.
	* @param  {array} componentIds
	* @example 
	* import {ComponentContext} from 'rainbow-foundation-cache'
	* ComponentContext.forceUpdate(['workListId']);
	*/
	forceUpdate: function(componentId){
		let componentArray = this.getComponent(componentId);
		
		$.each(componentArray, function(index, element){
			if(element.props.componentType == "UpdatePanel"){
				$("#" + element.props.id + "_hiddenBtn").trigger("click");
			} else {
				element.forceUpdate();
			}
		});
	}
	
};

