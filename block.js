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
                default: 'http://lavitz.local/wp-content/uploads/2024/09/Tree.glb',
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
                el( 'div', useBlockProps(),
                    el('p', {}, 'Three.js project will be rendered here.')
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
