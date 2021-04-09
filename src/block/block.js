/**
 * BLOCK: ministry-events
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';
import { RichText } from '@wordpress/block-editor';
import { DateTimePicker } from '@wordpress/components';
import { withState } from '@wordpress/compose';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, Button, ResponsiveWrapper } = wp.components;
const { Fragment } = wp.element;
const { withSelect } = wp.data;

function timeDisplayFriendly(timeToDisplay) {
	var d = new Date(timeToDisplay),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours(),
    ampm = d.getHours() >= 12 ? ' p.m.' : ' a.m.',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' - '+hours+':'+minutes+ampm;
}

const MyDateTimePicker = withState( {
	date: new Date(),
} )( ( { date, setState, setAttributes } ) => {
	return (
		<DateTimePicker
			currentDate={ date }
			onChange={ ( date ) => {
					setAttributes({ datetime: date });
					setState( { date } );
				}
			}
			is12Hour={ true }
		/>
	);
} );

// Added Image -> https://awhitepixel.com/blog/wordpress-gutenberg-add-image-select-custom-block/
const BlockEdit = (props) => {
	const { attributes, setAttributes, className } = props;

	const removeMedia = () => {
		setAttributes({
			mediaId: 0,
			mediaUrl: ''
		});
	}
 
 	const onSelectMedia = (media) => {
		setAttributes({
			mediaId: media.id,
			mediaUrl: media.url
		});
	}

	// Fields
	const onChangeHeading = ( newContent ) => { setAttributes( { heading: newContent } ) };
	const onChangeSubheading = ( newContent ) => { setAttributes( { subheading: newContent } ) };
	const onChangeAddress = ( newContent ) => { setAttributes( { address: newContent } ) };
	const onChangeExtratext = ( newContent ) => { setAttributes( { extratext: newContent } ) };
	
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={__('Select block background image', 'awp')}
					initialOpen={ true }
				>
					<div className="editor-post-featured-image">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectMedia}
								value={attributes.mediaId}
								allowedTypes={ ['image'] }
								render={({open}) => (
									<Button 
										className={attributes.mediaId == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
										onClick={open}
									>
										{attributes.mediaId == 0 && __('Choose an image', 'awp')}
										{props.media != undefined && 
						            			<ResponsiveWrapper
									    		naturalWidth={ props.media.media_details.width }
											naturalHeight={ props.media.media_details.height }
									    	>
									    		<img src={props.media.source_url} />
									    	</ResponsiveWrapper>
						            		}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						{attributes.mediaId != 0 && 
							<MediaUploadCheck>
								<MediaUpload
									title={__('Replace image', 'awp')}
									value={attributes.mediaId}
									onSelect={onSelectMedia}
									allowedTypes={['image']}
									render={({open}) => (
										<Button onClick={open} isSecondary isLarge>{__('Replace image', 'awp')}</Button>
									)}
								/>
							</MediaUploadCheck>
						}
						{attributes.mediaId != 0 && 
							<MediaUploadCheck>
								<Button onClick={removeMedia} isLink isDestructive>{__('Remove image', 'awp')}</Button>
							</MediaUploadCheck>
						}
					</div>
				</PanelBody>
			</InspectorControls>
			<div className={ className }>
				<div class="event-card">
					{ attributes.mediaUrl &&
					<div className="event-card--image" style={{ background: `url(${attributes.mediaUrl}) no-repeat center center / cover`, width: '45%' }}></div>
					}
					<div className="event-card--information" style={{
							width: attributes.mediaUrl ? '70%' : '100%',
							margin: attributes.mediaUrl ? '15px -90px' : '1em'
						}}>
							<RichText
								tagName="h3"
								onChange={ onChangeHeading }
								value={ attributes.heading }
								className="ec_main_heading"
							/>
							<RichText
								tagName="h5"
								onChange={ onChangeSubheading }
								value={ attributes.subheading }
								className="ec_sub_heading"
							/>
							<MyDateTimePicker setAttributes={setAttributes} />
							{attributes.datetime &&
								<p>{timeDisplayFriendly(attributes.datetime)}</p>
							}
							<RichText
								tagName="address"
								onChange={ onChangeAddress }
								value={ attributes.address }
								className="ec_address"
							/>
							<RichText
								tagName="p"
								onChange={ onChangeExtratext }
								value={ attributes.extratext }
								className="ec_free_text"
							/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

/**
 * Register: aa Gutenberg Block.
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
registerBlockType( 'cgb/block-ministry-events', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Card with Background' ), // Block title.
	icon: 'smiley', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'ministry-events — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	supports: {
		align: true
	},
	attributes: {
		heading: {
            type: 'array',
            source: 'html',
            selector: 'h3.ec_main_heading',
        },
		subheading: {
            type: 'array',
            source: 'html',
            selector: 'h5.ec_sub_heading',
        },
		address: {
            type: 'array',
            source: 'html',
            selector: 'address.ec_address',
        },
		extratext: {
            type: 'array',
            source: 'html',
            selector: 'p.ec_free_text',
        },
		datetime: {
			type: 'string',
			default: ''
		},
		mediaId: {
			type: 'number',
			default: 0
		},
		mediaUrl: {
			type: 'string',
			default: ''
		}
	},

	edit: withSelect((select, props) => {
		return { media: props.attributes.mediaId ? select('core').getMedia(props.attributes.mediaId) : undefined };
	})(BlockEdit),

	save: ({ attributes, className }) => {
		return (
			<div className={ className }>
				<div class="event-card">
					{ attributes.mediaUrl &&
					<div className="event-card--image" style={{ background: `url(${attributes.mediaUrl}) no-repeat center center / cover`, width: '45%' }}></div>
					}
					<div className="event-card--information" style={{
							width: attributes.mediaUrl ? '70%' : '100%',
							margin: attributes.mediaUrl ? '15px -90px' : '1em'
						}}>
							{attributes.heading &&
								<RichText.Content tagName="h3" value={ attributes.heading } className="ec_main_heading" />
							}
							{attributes.heading &&
								<RichText.Content tagName="h5" value={ attributes.subheading } className="ec_sub_heading" />
							}
							{attributes.datetime &&
								<address className="ec_address">{timeDisplayFriendly(attributes.datetime)}</address>
							}
							{attributes.extratext &&
								<RichText.Content tagName="p" value={ attributes.extratext } className="ec_free_text" />
							}
					</div>
				</div>
			</div>
		);
	},
} );
