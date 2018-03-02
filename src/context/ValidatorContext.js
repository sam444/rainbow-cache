import {ArrayUtil,Util} from 'rainbow-foundation-tools';
import configUrl from "../config/config";
/**
 * ValidatorContext is a page level validator cache. Once url changed the cache must be clear.
 * @module ValidatorContext
 */

module.exports = {

    form: null,

    validatorList: [],

    clear: function () {
        this.validatorList = [];
    },

    createValidator: function (validatorId) {
        let validator = {validatorId: validatorId, validator: {}};
        this.validatorList.push(validator);

        //let validator = Immutable.Map().set({validatorId: validatorId, validator: Immutable.Map()});
        //this.validatorList.push(validator);

        return validator;
    },

   
    getValidator: function (validatorId) {
        let validator = null;
        $.each(this.validatorList, (index, element) => {
            if (element.validatorId == validatorId) {
                validator = element.validator;
            }
        });

        /*$.each(this.validatorList, (index, element) => {
         if(element.validatorId == validatorId){
         validator = element.validator;
         }
         });*/

        return validator;
    },

   
    removeValidator: function (validatorId, componentId) {
        let validator = this.getValidator(validatorId);
        if (validator) {
            delete validator[componentId];
        }
    },

  
    getValidators: function (validatorIds, exceptValidationGroup) {
        let _self = this;
        let validatorIdArray = ArrayUtil.trimArray(validatorIds.split(","));
        let exceptValidatorIdArray = exceptValidationGroup == undefined ? [] :
            ArrayUtil.trimArray(exceptValidationGroup.split(","));
        let validatorJson = {};
        //let validatorJson = Immutable.Map();

        $.each(validatorIdArray, (index, element) => {
            if ($.inArray(element.validatorId, exceptValidatorIdArray) < 0) {
                validatorJson = $.extend(true, validatorJson, _self.getValidator(element));
                //validatorJson = validatorJson.merge(_self.getValidator(element));
            }
        });

        return validatorJson;
    },

  
    getAllValidator: function (exceptValidationGroup) {
        let validatorJson = {};
        let exceptValidatorIdArray = exceptValidationGroup == undefined ? [] :
            ArrayUtil.trimArray(exceptValidationGroup.split(","));
        $.each(this.validatorList, (index, element) => {
            if ($.inArray(element.validatorId, exceptValidatorIdArray) < 0) {
                validatorJson = $.extend(true, validatorJson, element.validator);
            }
        });

        /*let validatorJson = Immutable.Map();
         $.each(this.validatorList, (index, element) => {
         validatorJson = validatorJson.merge(element.validator);
         });*/

        return validatorJson;
    },

   
    getValidatorList: function () {
        return this.validatorList;
    },

    
    putValidator: function (validatorId, inputName, validatorJson) {
        let _self = this, validatorIdArray = ArrayUtil.trimArray(validatorId.split(","));

        //for(let element of validatorIdArray){
        $.each(validatorIdArray, (index, element) => {
            let validator = _self.getValidator(element);

            if (validator == undefined) {
                validator = _self.createValidator(element).validator;
            }
            //console.log(validator);

            if (validator[inputName] == undefined) {
                //var validatorJson2 = '{"' + inputName + '": {"validators":' + '{}' +'}}';
                let inputValidatorJson = '{"' + inputName + '": {"message": "The username is not valid", "validators":' + '{}' + '}}';
                $.extend(true, validator, $.parseJSON(inputValidatorJson));
                //validator.merge($.parseJSON(inputValidatorJson));
                validator = _self.getValidator(element);
            }

            $.extend(true, validator[inputName].validators, validatorJson);
            //validator[inputName].validators.merge(validatorJson);
        });
    },

    /**
	* Validate API , if you want to validate one component
	* @param  {string} componentId 
	* @example 
	* import {ValidatorContext} from 'rainbow-foundation-cache'
	* ValidatorContext.validateField("componentId")
	*/
    validateField: function (componentId) {
        let validatorJson = null;
        $.each(this.validatorList, (index, element) => {
            if(element.validator){
                _.each(_.keys(element.validator),(key)=>{
                    if(key==componentId){
                        validatorJson = element.validator;
                    }
                })
            }
        });
        if(validatorJson){
            this.validate(true, null, null,validatorJson) ;
        }
    },

    /**
    * Validate API , if you want to validate model
    * @param  {object} model 
	* @param  {string} groupCode
	* @example 
	* import {ValidatorContext} from 'rainbow-foundation-cache'
	* ValidatorContext.validateModel(policy,"AH_Proposal_Base_Validation").then((result)=>{
    *    const saving_url = UrlUtil.getConfigUrl("API_GATEWAY_PROXY", "POLICY_API", "SAVE_POLICY");
    *    PolicyStore.savePolicy(saving_url, policy, { "method": "POST" }).then((policy) => {
    *                this.state.code = super.formatJson(policy);
    *                this.setState({ policy: policy });
    *                AjaxUtil.hide();
    *    });
    * });
	*/
    validateModel: function (model,groupCode) {
        const _url = configUrl.getValidateModelURL+"?code="+groupCode;
        return AjaxUtil.call(_url,model,{"method":"POST"});
    },

    /**
	* Validate API , if you want to validate component
	* @param  {boolean} causeValidation  - set validate switch.
	* @param  {string} validationGroup  - set validate group, default all page.
	* @param  {string} exceptValidationGroup  - set except validate group, if validationGroup is null but you want some fields not validate.
	* @example 
	* import {ValidatorContext} from 'rainbow-foundation-cache'
	* ValidatorContext.validate(this.props.causeValidation, this.props.validationGroup, this.props.exceptValidationGroup)
	*/
    validate: function (causeValidation, validationGroup, exceptValidationGroup,validator) {
        // reset form
        if (this.form != null && $(this.form).data("bootstrapValidator") != undefined) {
            $(this.form).data("bootstrapValidator").resetForm();
            this.form.bootstrapValidator("destroy");
        }

        if (Util.parseBool(causeValidation)) {
            if(!validator){
                if (validationGroup != undefined) {
                    validator = this.getValidators(validationGroup, exceptValidationGroup);
                } else {
                    validator = this.getAllValidator(exceptValidationGroup);
                }
            }
            this.form = $("#registerForm").bootstrapValidator({
                message: "This value is not valid",
                excluded:[":disabled"],
                container: "popover",
                feedbackIcons: {
                    valid: "glyphicon glyphicon-ok",
                    invalid: "glyphicon glyphicon-remove",
                    validating: "glyphicon glyphicon-refresh"
                },
                fields: validator,
                submitHandler: function (validator, form, submitButton) {
                    return false;
                }
            }).bootstrapValidator("validate");

            //if invalid field, the first field focus
            if (!$(this.form).data("bootstrapValidator").isValid()) {
                let invalidField = $(this.form).data("bootstrapValidator").$invalidFields;
                if (invalidField.length > 0) {
                    // add validation css for select2
                    this.validateSelect2(invalidField);
                    // the first field focus
                    const component = $("#" + invalidField[0].id);
                    const navArr = $("nav[class*='fixed-top']");
                    const len = navArr.length;
                    if(len >0 ){
                        let height = 0;
                        let heightArr=[];
                        let i;
                        for(i=0;i<len;i++){
                            heightArr.push(navArr[i].offsetHeight)  
                        }
                        height = Math.max.apply(null, heightArr)+50;
                        $('html, body').animate({ scrollTop: component.offset().top - height }, 300);
                    }
                    component.focus();
                }
                return false;
            }
        }

        return true;
    },

    validateSelect2: function(invalidFields){
        _.each(invalidFields, (invalidField) => {
            if('SELECT' == invalidField.tagName){
                const component = $("#" + invalidField.id);
                let select2Obj = component.siblings('span.select2');
                let select2Selection = select2Obj.find('span.select2-selection');
                if(select2Selection && !select2Selection.hasClass('select2-validation')){
                    select2Selection.addClass("select2-validation");
                }
            }
        });
    }

};

