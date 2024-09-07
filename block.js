( function( blocks, editor, element ) {
    const el = element.createElement;
    const { useBlockProps } = editor;
    const { InspectorControls } = editor;
    const { PanelBody, TextControl, SelectControl } = wp.components;

    blocks.registerBlockType( 'custom/threejs-project', {
        title: 'Three.js Project',
        icon: 'screenoptions',
        category: 'embed',
        attributes: {
            modelUrl: {
                type: 'string',
                default: '/wp-content/uploads/2024/09/Tree.glb',
            },
            fileType: {
                type: 'string',
                default: 'glb', // Default to GLB
            },
        },
        edit: ( props ) => {
            const { attributes: { modelUrl, fileType }, setAttributes } = props;

            return [
                el( InspectorControls, null,
                    el( PanelBody, { title: 'Three.js Settings' },
                        el( TextControl, {
                            label: 'Model URL',
                            value: modelUrl,
                            onChange: ( value ) => setAttributes( { modelUrl: value } ),
                        }),
                        el( SelectControl, {
                            label: 'File Type',
                            value: fileType,
                            options: [
                                { label: 'GLB', value: 'glb' },
                                { label: 'FBX', value: 'fbx' },
                            ],
                            onChange: ( value ) => setAttributes( { fileType: value } ),
                        })
                    )
                ),
                el('div', useBlockProps(),
                    el('div', {
                        style: {
                            border: '2px dashed #ddd',
                            padding: '20px',
                            textAlign: 'center',
                            color: '#24566E',
                            fontSize: '1.25em',
                        }
                    },
                    el('p', {}, 'Three.js Wordpress Plugin by Starscape'),
                    el('img', {
                        src: threejsBlockData.iconUrl, // Replace with an appropriate icon or image URL
                        alt: '3D Model Icon',
                        style: {
                            maxWidth: '100px',
                            marginTop: '10px',
                        }
                    }))
                )
            ];
        },
        save: ( props ) => {
            return el( 'div', useBlockProps.save(), el('p', {}, 'Three.js Project') );
        },
    });
} )(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element
);
