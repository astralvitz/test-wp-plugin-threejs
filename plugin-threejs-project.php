<?php
/*
Plugin Name: Three.js Project Embed Block
Description: A Gutenberg block to embed a Three.js project in a page or post.
Version: 1.0
*/

function register_threejs_project_block() {
    // Enqueue block editor JavaScript and CSS
    wp_register_script(
        'threejs-project-block',
        plugins_url( 'block.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-block-editor' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
    );

    wp_register_style(
        'threejs-project-block-editor',
        plugins_url( 'block.css', __FILE__ ),
        array( 'wp-edit-blocks' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'block.css' )
    );

    wp_register_style(
        'threejs-project-block-frontend',
        plugins_url( 'block.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'block.css' )
    );

    // Register the block
    register_block_type( 'custom/threejs-project', array(
        'editor_script' => 'threejs-project-block',
        'editor_style' => 'threejs-project-block-editor',
        'style' => 'threejs-project-block-frontend',
        'render_callback' => 'render_threejs_project',
    ) );
}
add_action( 'init', 'register_threejs_project_block' );

// Enqueue Three.js and related scripts
function threejs_project_enqueue_assets() {
    wp_enqueue_script(
        'three-js',
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
        array(),
        null,
        false
    );
    wp_enqueue_script(
        'three-js-orbit-controls',
        'https://cdn.jsdelivr.net/npm/three@0.138.0/examples/js/controls/OrbitControls.js',
        array(),
        null,
        false
    );
    wp_enqueue_script(
        'three-js-gltf-loader',
        'https://cdn.jsdelivr.net/npm/three@0.138.0/examples/js/loaders/GLTFLoader.js',
        array(),
        null,
        false
    );

    // Enqueue fflate for compressed FBX support
    wp_enqueue_script(
        'three-js-fflate',
        'https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js',
        array(),
        null,
        false
    );

    // Enqueue FBXLoader
    wp_enqueue_script(
        'three-js-fbx-loader',
        'https://cdn.jsdelivr.net/npm/three@0.138.0/examples/js/loaders/FBXLoader.js',
        array(),
        null,
        false
    );
}
add_action( 'wp_enqueue_scripts', 'threejs_project_enqueue_assets' );

// Render function for the block
function render_threejs_project($attributes) {
    // Set a default value for modelUrl if it isn't provided
    $model_url = isset($attributes['modelUrl']) && !empty($attributes['modelUrl']) 
        ? esc_url($attributes['modelUrl']) 
        : 'http://lavitz.local/wp-content/uploads/2024/09/Tree.glb'; // Default URL
    $file_type = isset($attributes['fileType']) ? $attributes['fileType'] : 'glb'; // Default to GLB

    ob_start();
    ?>
    <div class='canvas-container'>
        <canvas id='canvas'></canvas>
    </div>
    <script>
        const canvas = document.getElementById('canvas');
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true});
        renderer.setClearColor( 0x000000, 0 );
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Set up the loader based on file type
        var loader;
        if ('<?php echo $file_type; ?>' === 'glb') {
            loader = new THREE.GLTFLoader(); // GLTFLoader for .glb files
        } else if ('<?php echo $file_type; ?>' === 'fbx') {
            loader = new THREE.FBXLoader(); // FBXLoader for .fbx files
        }
        
        // Load the model using the appropriate loader
        loader.load('<?php echo $model_url; ?>', function(modelData) {
            var model = '<?php echo $file_type; ?>' === 'glb' ? modelData.scene : modelData;
            model.scale.set(.5, .5, .5); // Adjust size
            model.position.y = -1; // Adjust position
            scene.add(model);

            // Clone the model and create multiple instances
            // for (let i = -5; i <= 5; i++) {
            //     var clone = model.clone();   // Clone the original model
            //     clone.position.set(i * 2, -1, 0); // Position the clone (change position to avoid overlap)
            //     scene.add(clone);
            // }
        }, undefined, function(error) {
            console.error('An error occurred while loading the model', error);
        });

        var ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.enablePan = true;

        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    </script>
    <?php
    return ob_get_clean();
}