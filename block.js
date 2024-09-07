( function( blocks, editor, element ) {
    const el = element.createElement;
    const { useBlockProps, MediaUpload, MediaUploadCheck } = editor;
    const { InspectorControls } = editor;
    const { PanelBody, TextControl, SelectControl, RangeControl } = wp.components;

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
                default: 'glb',
            },
            cameraFov: {
                type: 'number',
                default: 75,
            },
            cameraAspectRatio: {
                type: 'number',
                default: 1.77777778,
            },
            cameraPositionX: {
                type: 'number',
                default: 0,
            },
            cameraPositionY: {
                type: 'number',
                default: 0,
            },
            cameraPositionZ: {
                type: 'number',
                default: 5,
            },
            rendererWidth: {
                type: 'number',
                default: 512,
            },
            rendererHeight: {
                type: 'number',
                default: 288,
            }
        },
        edit: ( props ) => {
            const {
                attributes: {
                    modelUrl, fileType,
                    cameraFov, cameraAspectRatio,
                    cameraPositionX, cameraPositionY, cameraPositionZ,
                    rendererWidth, rendererHeight
                },
                setAttributes
            } = props;

            return [
                el( InspectorControls, null,
                    el( PanelBody, { title: 'Three.js Settings' },
                        el('div', { style: { marginBottom: '20px' } },  // Add margin-bottom here
                            el(MediaUploadCheck, {},
                                el(MediaUpload, {
                                    onSelect: (media) => setAttributes({ modelUrl: media.url }), // Set the model URL
                                    allowedTypes: ['application/octet-stream', 'model/gltf-binary', 'model/gltf+json', 'application/zip'],
                                    render: ({ open }) => el('button', {
                                        onClick: open,
                                        className: 'button button-large'
                                    }, !modelUrl ? 'Select 3D Model' : 'Change 3D Model')
                                })
                            )
                        ),
                        el( SelectControl, {
                            label: 'File Type',
                            value: fileType,
                            options: [
                                { label: 'GLB', value: 'glb' },
                                { label: 'FBX', value: 'fbx' },
                            ],
                            onChange: ( value ) => setAttributes( { fileType: value } ),
                        })
                    ),
                    el(PanelBody, { title: 'Three.js Camera Settings' },
                        el(TextControl, {
                            label: 'Field of View (FOV)',
                            type: 'number',
                            value: cameraFov,
                            onChange: (value) => setAttributes({ cameraFov: parseFloat(value) })
                        }),
                        el(TextControl, {
                            label: 'Aspect Ratio',
                            type: 'number',
                            value: cameraAspectRatio,
                            onChange: (value) => setAttributes({ cameraAspectRatio: parseFloat(value) })
                        }),
                        el(RangeControl, {
                            label: 'Camera Position X',
                            value: cameraPositionX,
                            min: -50, max: 50,
                            onChange: (value) => setAttributes({ cameraPositionX: value })
                        }),
                        el(RangeControl, {
                            label: 'Camera Position Y',
                            value: cameraPositionY,
                            min: -50, max: 50,
                            onChange: (value) => setAttributes({ cameraPositionY: value })
                        }),
                        el(RangeControl, {
                            label: 'Camera Position Z',
                            value: cameraPositionZ,
                            min: -50, max: 50,
                            onChange: (value) => setAttributes({ cameraPositionZ: value })
                        })
                    ),
                    el(PanelBody, { title: 'Renderer Settings' },
                        el(TextControl, {
                            label: 'Renderer Width',
                            type: 'number',
                            value: rendererWidth,
                            onChange: (value) => setAttributes({ rendererWidth: parseInt(value, 10) })
                        }),
                        el(TextControl, {
                            label: 'Renderer Height',
                            type: 'number',
                            value: rendererHeight,
                            onChange: (value) => setAttributes({ rendererHeight: parseInt(value, 10) })
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
                            animation: 'spin 5s linear infinite',
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
    window.wp.element,
    window.wp.components // Added components for SelectControl
);
