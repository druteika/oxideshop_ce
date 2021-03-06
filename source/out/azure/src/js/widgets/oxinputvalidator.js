/**
 *    This file is part of OXID eShop Community Edition.
 *
 *    OXID eShop Community Edition is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    OXID eShop Community Edition is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with OXID eShop Community Edition.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link      http://www.oxid-esales.com
 * @package   out
 * @copyright (C) OXID eSales AG 2003-2014
 * @version OXID eShop CE
 * @version   SVN: $Id: oxinputvalidator.js 35529 2011-05-23 07:31:20Z vilma $
 */
( function( $ ) {

    oxInputValidator = {
            options: {
                classValid                 : "oxValid",
                classInValid               : "oxInValid",
                errorParagraf              : "p.oxValidateError",
                errorMessageNotEmpty       : "js-oxError_notEmpty",
                errorMessageNotEmail       : "js-oxError_email",
                errorMessageShort          : "js-oxError_length",
                errorMessageNotEqual       : "js-oxError_match",
                errorMessageIncorrectDate  : "js-oxError_incorrectDate",
                metodValidate              : "js-oxValidate",
                metodValidateEmail         : "js-oxValidate_email",
                metodValidateNotEmpty      : "js-oxValidate_notEmpty",
                metodValidateLength        : "js-oxValidate_length",
                metodValidateMatch         : "js-oxValidate_match",
                metodValidateDate          : "js-oxValidate_date",
                idPasswordLength           : "#passwordLength",
                listItem                   : "li",
                list                       : "ul",
                paragraf                   : "p",
                span                       : "span",
                form                       : "form",
                visible                    : ":visible"
            },

            _create: function() {

                var self    = this,
                    options = self.options,
                    el      = self.element;

                el.delegate("."+options.metodValidate, "blur", function() {

                    var oTrigger = this; 
                    // the element who caused the event
                    // adding a timeout to delay the callback from modifying the form
                    // this allows other events like CLICK to be called before the blur event
                    // this happens only on some browsers where blur has higher priority than click
                    setTimeout(function(){
                        if ( $( oTrigger ).is(options.visible) ) {
                            var oFieldSet = self.getFieldSet( oTrigger );
                            if ( oFieldSet.children( '.'+options.metodValidateDate ).length <= 0 ) {
                                var blIsValid = self.isFieldSetValid( oFieldSet, true );
                                self.hideErrorMessage( oFieldSet );
                                if ( blIsValid != true ){
                                    self.showErrorMessage( oFieldSet, blIsValid );
                                }
                            }
                        }
                    }, 50);
                });

                el.bind( "submit", function() {
                    return self.submitValidation(this);
                });
            },

            /**
             * Validate form element, return forms true - valid, false - not valid
             *
             * @return boolean
             */
            inputValidation: function( oInput, blCanSetDefaultState )
            {
                var oOptions = this.options;
                var self = this;
                var blValidInput = true;

                    if ( $( oInput ).hasClass( oOptions.metodValidateNotEmpty ) && blValidInput ) {
                        if (! $.trim( $( oInput ).val()) ){
                            return oOptions.errorMessageNotEmpty;
                        }
                    }

                    if ( $( oInput ).hasClass( oOptions.metodValidateEmail ) && blValidInput ) {

                        if( $( oInput ).val()  ) {

                            if ( !self.isEmail( $( oInput ).val() ) ){
                                return oOptions.errorMessageNotEmail;
                            }
                        }
                    }


                    if ( $( oInput ).hasClass( oOptions.metodValidateLength ) && blValidInput ) {

                        var iLength = self.getLength( $( oInput ).closest(oOptions.form ));
                        if( $( oInput ).val() ) {
                            if ( !self.hasLength( $( oInput ).val(), iLength ) ) {
                                return  oOptions.errorMessageShort;
                            }
                        }
                    }

                    if ( $( oInput ).hasClass( oOptions.metodValidateMatch ) && blValidInput ) {

                        var inputs = new Array();

                        var oForm = $( oInput ).closest(oOptions.form);

                        $( "." + oOptions.metodValidateMatch, oForm).each( function(index) {
                            inputs[index] = this;
                        });

                        if( $(inputs[0]).val() && $(inputs[1]).val() ) {

                            if( !self.isEqual($(inputs[0]).val(), $(inputs[1]).val()) ) {
                                return oOptions.errorMessageNotEqual;
                            }
                        }
                    }

                    if ( $( oInput ).hasClass( oOptions.metodValidateDate ) ) {
                        oDay   = $( oInput ).parent().children( '.oxDay' );
                        oMonth = $( oInput ).parent().children( '.oxMonth' );
                        oYear  = $( oInput ).parent().children( '.oxYear' );
                        
                        if ( !( oDay.val() && oMonth.val() && oYear.val() ) && !( !oDay.val() && !oMonth.val() && !oYear.val() ) ) {
                            return oOptions.errorMessageNotEmpty;
                        } else if ( oDay.val() && oMonth.val() && oYear.val() ) {
                            RE = /^\d+$/;
                            blDayOnlyDigits  = RE.test( oDay.val() );
                            blYearOnlyDigits = RE.test( oYear.val() );
                            if ( !blDayOnlyDigits || !blYearOnlyDigits ) {
                                return oOptions.errorMessageIncorrectDate;
                            } else {
                                iMonthDays = new Date((new Date(oYear.val(), oMonth.val(), 1))-1).getDate();
                                
                                if ( oDay.val() <= 0 || oYear.val() <= 0 || oDay.val() > iMonthDays ) {
                                    return oOptions.errorMessageIncorrectDate;
                                }
                            }
                        }
                    }

                    if ( $( oInput ).hasClass( oOptions.metodValidate ) && blCanSetDefaultState) {

                        if( !$( oInput ).val()){
                            self.setDefaultState( oInput );
                            return true;
                        }
                    }

                return blValidInput;
            },

            /**
             * On submit validate required form elements,
             * return true - if all filled correctly, false - if not
             *
             * @return boolean
             */
            submitValidation: function( oForm )
            {
                var blValid = true;
                var oFirstNotValidElement = null;
                var self = this;
                var oOptions = this.options;

                $( "." + oOptions.metodValidate, oForm).each(    function(index) {

                    if ( $( this ).is(oOptions.visible) ) {

                        var oFieldSet = self.getFieldSet(this);
                        self.hideErrorMessage( oFieldSet );
                        var blIsValid = self.isFieldSetValid( oFieldSet, false );
                        if ( blIsValid != true ){
                            self.showErrorMessage( oFieldSet, blIsValid );
                            blValid = false;
                            if( oFirstNotValidElement == null ) {
                                oFirstNotValidElement = this;
                            }
                        }
                    }
                });

                if( oFirstNotValidElement != null ) {
                    $( oFirstNotValidElement ).focus();
                }

                return blValid;
            },

            isFieldSetValid: function ( oFieldSet, blCanSetDefaultState ) {

                var blIsValid = true;
                var self = this;
                var oOptions = this.options;
                $("." + oOptions.metodValidate + ":not(:focus)", oFieldSet).each( function(index) {

                    if ( $( this ).is(oOptions.visible) ) {
                        var tmpblIsValid = self.inputValidation( this, blCanSetDefaultState );

                        if( tmpblIsValid != true){
                            blIsValid = tmpblIsValid;
                        }
                    }
                });

                return blIsValid;
            },

            /**
             * returns li element
             *
             *
             * @return object
             */
            getFieldSet: function( oField ){

               var oFieldSet =  $( oField ).parent();

               return oFieldSet;
            },

            /**
             * Show error messages
             *
             * @return object
             */
            showErrorMessage: function ( oObject, messageType )
            {
                oObject.removeClass(this.options.classValid);
                oObject.addClass(this.options.classInValid);
                oObject.children(this.options.errorParagraf).children( this.options.span + "." + messageType ).show();
                oObject.children(this.options.errorParagraf).show();

                return oObject;
            },

            /**
             * Hide error messages
             *
             * @return object
             */
            hideErrorMessage: function ( oObject )
            {
                this.hideMatchMessages( oObject );

                oObject.removeClass(this.options.classInValid);
                oObject.addClass(this.options.classValid);
                oObject.children(this.options.errorParagraf).children( this.options.span ).hide();
                oObject.children(this.options.errorParagraf).hide();

                return oObject;
            },

            /**
             * has match error messages
             *
             * @return boolean
             */
            hasOpenMatchMessage: function ( oObject )
            {
                return $( '.'+this.options.errorMessageNotEqual, oObject ).is( this.options.visible )
            },

            /**
             * Hide match error messages
             *
             * @return object
             */
            hideMatchMessages: function ( oObject )
            {
                if ( this.hasOpenMatchMessage( oObject.next(this.options.listItem) ) ){
                    this.hideErrorMessage( oObject.next(this.options.listItem) );
                }

                if ( this.hasOpenMatchMessage( oObject.prev(this.options.listItem) ) ){
                    this.hideErrorMessage( oObject.prev(this.options.listItem) );
                }
            },

            /**
             * Set default look of form list element
             *
             * @return object
             */
            setDefaultState: function ( oObject )
            {
                var oObject = $( oObject ).parent();

                oObject.removeClass(this.options.classInValid);
                oObject.removeClass(this.options.classValid);
                oObject.children(this.options.errorParagraf).hide();

                oOptions = this.options;

                $( this.options.span, oObject.children( this.options.errorParagraf ) ).each( function(index) {
                    oObject.children( oOptions.errorParagraf ).children( oOptions.span ).hide();
                });

                return oObject;
            },

            /**
             * gets required length from form
             *
             * @return boolean
             */
            getLength: function(oObject){

                oOptions = this.options;

                return $( oOptions.idPasswordLength , oObject).val();
            },
            /**
             * Checks length
             *
             * @return boolean
             */
            hasLength: function( stValue, length )
            {
                stValue = jQuery.trim( stValue );

                if( stValue.length >= length ) {
                    return true;
                }

                return false;
            },

            /**
             * Checks mails validation
             *
             * @return boolean
             */
            isEmail: function( email )
            {
                email = jQuery.trim(email);

                var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

                if(reg.test(email) == false) {
                    return false;
                }

                return true;
            },

            /**
             * Checks is string equal
             *
             * @return boolean
             */
            isEqual: function( stValue1, stValue2 )
            {
                stValue1 = jQuery.trim(stValue1);
                stValue2 = jQuery.trim(stValue2);

                if (stValue1 == stValue2){
                    return true;
                }

                return false;
            }
        };

    /**
     * Form Items validator
     */
    $.widget("ui.oxInputValidator", oxInputValidator );


} )( jQuery );