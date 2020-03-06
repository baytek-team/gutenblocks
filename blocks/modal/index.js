/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import icon from './icon';
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, MediaUpload, PlainText, InnerBlocks } = wp.blockEditor;
const { CheckboxControl, SelectControl, ColorPicker, PanelBody} = wp.components;

// takes the style type attributes entered in the backend form and converts them to inline styles
// styles - object
const baytekFormatStyles = (styles) => {

  // loop round the object of styles passed to us 
  let formatedStyles = {}; // returned set of styles in an object
  for (let style in styles) {

    switch (style) {
      case 'fontSize':
      case 'padding':
      case 'borderRadius':
        
        // first check if any number exists in string / if not then do nothing

        if (!isNaN(parseFloat(styles[style]))) {

          // split string of values into array e.g. 10px 5px 5px 10px
          let styleValues = styles[style].split(" ");
          let formatStyleValue = '';
          
          let valueCount = 0;

          // loop round the array of style values formatting
          // each one depending upon %, em, rem, or px

          styleValues.forEach(function(styleValue) {

            // we only have max of 4 values for padding, 1 for everything else
            if (((style === 'padding' || style === 'borderRadius') && valueCount < 4) ||
              ( style !== 'padding' && style !== 'borderRadius' && valueCount < 1 )) { 
              if (styleValue.includes('%')) {
                formatStyleValue += parseInt(styleValue) + '% ';
              } else if (styleValue.includes('rem')) {
                formatStyleValue += parseFloat(styleValue) + 'rem ';
              } else if (styleValue.includes('em')) {
                formatStyleValue += parseFloat(styleValue) + 'em ';
              } else {
              // assume we are dealing with px
                formatStyleValue += parseInt(styleValue) + 'px ';
              }
              valueCount ++;
            }
          }); // end for each
          formatedStyles[style] = formatStyleValue;

        } // end NaN check
        break;

      case 'color':
      case 'backgroundColor':
        // extract rgba color from object color
        if (typeof styles[style] === 'object') {  
          const {rgb} = styles[style];
          const {r,g,b,a} = rgb;
          formatedStyles[style] = "rgba("+ r + "," + g + "," + b + "," + a + ")";
        } else {
          formatedStyles[style] = styles[style];
        }
        break;
      
      case 'textAlign':
        formatedStyles[style] = styles[style];
        break;                
    } // end switch 

  } // end styles loop 

  return formatedStyles;

}

/**
 * Register: Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'baytek/modal-block', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: __( 'Modal Block', 'baytek-modal' ), // Block title.
  icon: icon,
  category: 'widgets', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [
    __( 'modal' , 'baytek-modal' ),
    __( 'popup' , 'baytek-modal' ),
    __( 'window' , 'baytek-modal' )
  ],

  attributes: {
    title: {
      type: "string",
      default: "Modal Title"  
    },
    showDelay: {
      type: "string",
      default: "0"
    },  
    triggerSelector: {
      type: "string",
      default: "triggerclass"
    },
    overlayBackgdColor: {
      type: "string",
      default: "#000000" 
    },
    modalBackgdColor: {
      type: "string",
      default: "#ffffff"  
    },
    modalPadding: {
      type: "string",
      default: "3rem"
    },
    titlePadding: {
      type: "string",
      default: "3rem"
    },
    modalRadius: {
      type: "string",
      default: "10"
    }
  },

  

  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  edit: function( {attributes, className, setAttributes, isSelected, clientId} ) {
    

    // If innerblock is selected then we want to keep parent modal block open
    // returns true if child innerblock is selected

    function checkInnerblockSelected () {
      const select = wp.data.select('core/editor');
      const selected = select.getBlockSelectionStart();
      const inner = select.getBlock(clientId).innerBlocks;
      for (let i = 0; i < inner.length; i++) {
        if (inner[i].clientId === selected) {
          return true;
        }
      }
      return false;
    }


    // trigger class

    const trigger = () => {
        return (
          <span className="baytek-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}>{__('Modal with class selector','baytek-modal')}</span>
        );
      
    }

    // Figure out if we need to display the title and innerblocks fields
    // we only display if block is currently selected 

    const dispTitleInnerBlock = (blockSelected) => {
      if (blockSelected || checkInnerblockSelected()) {
        return (
          <div>
            <PlainText
              onChange={ content => setAttributes({ title: content})}
              value={attributes.title}
              placeholder={__('Modal Title Text','baytek-modal')}
            />
        
            <label>{__('Modal Content:','baytek-modal')}</label>
            <div className="baytek-form-innerblock">
              <InnerBlocks />
            </div>
          </div>
        );
      } else {
        return null;
      }
    }
    
    return (
      <div>
      

        <div className= {'baytek-block-popup ' + 'align-' + attributes.textAlign + ' ' + className}>
          {trigger()}
        
          {/* Modal Overlay */}
          <div style={baytekFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="baytek-block-popup-overlay"></div>
        
          {/* Modal Content */}
          <div  role="dialog" aria-modal="false" aria-labelledby="" aria-describedby=""  style={baytekFormatStyles ({'backgroundColor': attributes.modalBackgdColor, 'borderRadius': attributes.modalRadius})} className={"baytek-block-popup-wrap "}>
            <div id="" style={baytekFormatStyles ({'backgroundColor': attributes.titleBackgdColor, 'padding': attributes.titlePadding}) } className = "baytek-modal-title">
              <h2 style={baytekFormatStyles ({'fontSize': attributes.titleSize})}>{attributes.title}</h2>
            </div> {/* end title */}
            <div id=""  style={baytekFormatStyles ({'padding': attributes.modalPadding})} className="baytek-modal-content">
              {/*<InnerBlocks.Content/>*/}
            </div> {/* end content */}
            <div className="baytek-block-popup-closer"></div>
          </div> {/* end modal content */}

        </div>


        <div className="baytek-form">

          {dispTitleInnerBlock(isSelected)}

          <InspectorControls>
            <PanelBody
              title={__('Trigger','baytek-modal')}
              initialOpen={true}
              className="baytek-form"
            >         
                  {/*******************/}
                  {/*    Trigger Tab  */}
                  {/*******************/}




              {/* Trigger Class Selector */}

              <label>{__('Trigger Class Selector:','baytek-modal')}</label>  
              <PlainText
                onChange={ content => setAttributes({ triggerSelector: content }) }
                value={ attributes.triggerSelector }
                placeholder={__('Trigger Class Selector','baytek-modal')}
              />



            </PanelBody>
            <PanelBody
              title={__('Style','baytek-modal')}
              initialOpen={false}
              className="baytek-form"
            >
                  {/*******************/}
                  {/*     Style Tab   */}
                  {/*******************/}

                {/* Title Padding*/}

                <label>{__('Title Padding:','baytek-modal')}</label> 
                <PlainText
                  onChange={ content => setAttributes({ titlePadding: content }) }
                  value={ attributes.titlePadding }
                  placeholder={__('Title padding px, em, rem, %','baytek-modal')}
                />  


              {/* Modal Padding*/}

              <label>{__('Modal Padding:','baytek-modal')}</label> 
              <PlainText
                onChange={ content => setAttributes({ modalPadding: content }) }
                value={ attributes.modalPadding }
                placeholder={__('Modal padding px, em, rem, %','baytek-modal')}
              />  


              {/* Modal Border Radius */}

              <label>{__('Modal Border Radius:','baytek-modal')}</label> 
              <PlainText
                onChange={ content => setAttributes({ modalRadius: content }) }
                value={ attributes.modalRadius }
                placeholder={__('Modal radius for border','baytek-modal')}
              />  


              {/* Overlay background color */}

              <label>{__('Overlay Background Color:','baytek-modal')}</label>  
              <ColorPicker
                color={ attributes.overlayBackgdColor }
                onChangeComplete={ ( color ) => setAttributes({ overlayBackgdColor: 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'}) }
              />     


              {/* Modal background color */}

              <label>{__('Modal Background Color:','baytek-modal')}</label>  
              <ColorPicker
                color={ attributes.modalBackgdColor }
                onChangeComplete={ ( color ) => setAttributes({ modalBackgdColor: 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')'}) }
              />

            </PanelBody>
            
          </InspectorControls>
        </div> {/* end baytek-form */}


      </div>
    );

  },

  /**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  save: function( {attributes} ) {


    // format the trigger content which is either an image, link text, 

    const trigger = () => {
        return (
          <span className="baytek-block-popup-trigger type_selector" data-selector={attributes.triggerSelector}></span>
        );
    }

    return (
      <div className= {'baytek-block-popup ' + 'align-' + attributes.textAlign}>
        {trigger()}
      
        {/* Modal Overlay */}
        <div style={baytekFormatStyles ({'backgroundColor': attributes.overlayBackgdColor})} className="baytek-block-popup-overlay"></div>
      
        <div role="dialog" aria-modal="false" aria-labelledby="" aria-describedby="" className={"baytek-block-popup-wrap"}>
          {/* Modal Content */}
          <div style={baytekFormatStyles ({'backgroundColor': attributes.modalBackgdColor, 'borderRadius': attributes.modalRadius})} className={"baytek-block-popup "}>
            <div id="" style={baytekFormatStyles ({'backgroundColor': attributes.titleBackgdColor, 'padding': attributes.titlePadding}) } className = "baytek-modal-title">
              <h2 style={baytekFormatStyles ({'color': attributes.titleColor, 'fontSize': attributes.titleSize})}>{attributes.title}</h2>
            </div> {/* end title */}
            <div id=""  style={baytekFormatStyles ({'padding': attributes.modalPadding})} className="baytek-modal-content">
              {<InnerBlocks.Content/>}
            </div> {/* end content */}
            <div className="baytek-block-popup-closer"></div>
          </div> {/* end modal content */}
          
        </div>

      </div>
    );
  },
} );
