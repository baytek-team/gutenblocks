/**
 * External Dependencies
 */
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import HeadingToolbar from './lib/heading-toolbar';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { 
	RichText,
	InnerBlocks,
	BlockControls,
	InspectorControls,
} = wp.editor;
const {
	PanelBody,
	PanelRow,
	FormToggle,
} = wp.components;


/**
 * Block edit component
 * @param {object} props
 */
export default function edit( {
	attributes,
	setAttributes,
	isSelected,
	className,
} ) {
	const { 
		content, 
		level,
		expandedDefault,
	} = attributes;

	// Level 1 is paragraph (default), otherwise a heading level
	const tagName = level === 1 ? 'p' : 'h' + level;

	const toggleExpandedDefault = () => setAttributes( { expandedDefault: ! expandedDefault } );

	return [
		<BlockControls>
			<HeadingToolbar 
				minLevel={ 1 } 
				maxLevel={ 7 } 
				selectedLevel={ level } 
				onChange={ ( newLevel ) => setAttributes( { level: newLevel } ) } 
			/>
		</BlockControls>,
		<InspectorControls>
			<PanelBody title={ __( 'Settings', 'baytek-gutenberg' ) }>
				<PanelRow>
					<label htmlFor="expanded-default-form-toggle">
						{ __( 'Expanded by default', 'baytek-gutenberg' ) }
					</label>
					<FormToggle
						id="expanded-default-form-toggle"
						label={ __( 'Expanded by default', 'baytek-gutenberg' ) }
						checked={ expandedDefault }
						onChange={ toggleExpandedDefault }
					/>
				</PanelRow>
			</PanelBody>
			<PanelBody title={ __( 'Header Settings', 'baytek-gutenberg' ) } initialOpen={ false }>
				<p>{ __( 'HTML Element', 'baytek-gutenberg' ) }</p>
				<HeadingToolbar 
					isCollapsed={ false } 
					minLevel={ 1 } 
					maxLevel={ 7 } 
					selectedLevel={ level } 
					onChange={ ( newLevel ) => setAttributes( { level: newLevel } ) } 
				/>
			</PanelBody>
		</InspectorControls>,
		<div className={ classnames(className, { 'expanded': expandedDefault }) }>
			<RichText
				identifier="content"
				tagName={ tagName }
				wrapperClassName="toggle-header"
				placeholder={ __( 'Add a toggle header', 'baytek-gutenberg' ) }
				keepPlaceholderOnFocus={ true }
				allowedFormats={ [ 'core/bold', 'core/italic', ] }
				onChange={ content => setAttributes( { content } ) }
				value={ content }
			/>
			<InnerBlocks 
				allowedBlocks={ [ 
					'core-embed/facebook',
					'core-embed/instagram',
					'core-embed/twitter',
					'core-embed/vimeo',
					'core-embed/youtube',
					'core/button',
					'core/file',
					'core/gallery',
					'core/heading',
					'core/image',
					'core/list',
					'core/media-text',
					'core/paragraph',
					'core/quote',
					'core/table',
					'core/video',
				] } 
			/>
		</div>
	];
}
