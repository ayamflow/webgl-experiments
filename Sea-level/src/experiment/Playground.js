var Playground = function()
{
    this.isDebug = true;
    if(this.isDebug)
    {
        this.debug();
    }

    // Kick it !
    this.init();
    this.initGui();
    this.render();
};

Playground.prototype = {
    init: function()
    {
        this.quadNumbers = 20;
        this.theta = 0;

        this.initRenderer();
        this.initMeshes();
        this.initLights();
        this.initText("SEA LEVEL");
        this.initBloom();

        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    },

    initRenderer: function() {
        this.resize = new Resize();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(45, this.resize.screenWidth / this.resize.screenHeight, 0.1, 10000);
        this.scene = new THREE.Scene();

        this.scene.add(this.camera);
        this.camera.position.z = 500;

        this.renderer.setSize(this.resize.screenWidth, this.resize.screenHeight);

        document.body.appendChild(this.renderer.domElement);
    },

    initMeshes: function() {
        this.waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, this.quadNumbers, this.quadNumbers), new THREE.MeshPhongMaterial({color: 0x00FFCC, shading: THREE.FlatShading}));
        this.waterMesh.position.z = 5;
        this.waterMesh.geometry.dynamic = true;

        var vertices = this.waterMesh.geometry.vertices;
        for(var i = 0; i < this.quadNumbers * this.quadNumbers; i++) {
            vertices[i].z = MathHelper.rand(-5, 5);
        }

        this.scene.add(this.waterMesh);

        this.waterPosition = [];

        vertices = this.waterMesh.geometry.vertices;
        for(i = 0; i < vertices.length; i++) {
            this.waterPosition.push(vertices[i].z);
        }

        this.updateGeometry(this.waterMesh.geometry);
    },

    initText: function(textString) {
        this.letters = [];

        for(var i = 0; i < textString.length; i++) {
            var letter = textString[i];
            if(letter != " ") {
                var letterGeometry = new THREE.TextGeometry(letter, {
                    size: 30,
                    height: 20,
                    curveSegments: 2,
                    font: "optimer"
                });
                letterGeometry.computeBoundingBox();
                // var centerOffset = - 0.5 * (letterGeometry.boundingBox.max.x - letterGeometry.boundingBox.min.x);
                var centerOffset = -150;

                var textMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.7} );
                var letter3d = new THREE.Mesh(letterGeometry, textMaterial);

                letter3d.position.x = centerOffset + i * 40;
                letter3d.position.y = 100;
                letter3d.position.z = 5;

                letter3d.rotation.x = Math.PI / 2;

                this.letters.push(letter3d);
                this.scene.add(letter3d);
            }
        }
    },

    updateGeometry: function(geometry) {
        geometry.computeFaceNormals();
    },

    initLights: function() {
        this.spotLight = new THREE.SpotLight(0xFFFFFF, 2, 800);
        this.spotLight.castShadow = true;
        this.spotLight.position.set(100 * Math.cos(Math.PI / 2) * 3, 100 * Math.sin(Math.PI / 2) * 3, 500);
        this.scene.add(this.spotLight);

        this.spotLightHelper = new THREE.Mesh(new THREE.SphereGeometry(10, 8, 8), new THREE.MeshBasicMaterial({color: 0x2899EB}));
        this.spotLightHelper.position = this.spotLight.position;
        // this.scene.add(this.spotLightHelper);

        this.moonLight = new THREE.SpotLight(0xFF0000, 10, 10000);
        this.moonLight.castShadow = true;
        this.moonLight.position.x = 500;
        this.scene.add(this.moonLight);

        this.moonLightHelper = new THREE.Mesh(new THREE.SphereGeometry(10, 8, 8), new THREE.MeshBasicMaterial({color: 0xFF0000}));
        this.moonLightHelper.position = this.moonLight.position;
        // this.scene.add(this.moonLightHelper);

        this.ambientLight = new THREE.AmbientLight(0x111144);
        this.scene.add(this.ambientLight);
    },

    initBloom: function() {
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

        this.bloomPass = new THREE.BloomPass(1.2);
        this.composer.addPass(this.bloomPass);

        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;
        this.composer.addPass(copyShader);
    },

    customRender: function() {
        var time = Date.now() * 0.001;

        this.moonLight.position.set(150 * Math.sin(time / 4 + Math.PI), 150, 150 * Math.cos(time / 4 + Math.PI));
        this.moonLightHelper.position = this.moonLight.position;

        this.flowWater(this.waterMesh, this.waterPosition, time);

        for(var i = 0; i < this.letters.length; i++) {
            this.letters[i].position.z = 5 * Math.cos(time * 0.2 * (i + 1));
        }
    },

    render: function()
    {
        if(this.isDebug)
        {
            this.stats.update();
        }

        this.controls.update();

        this.customRender();

        this.renderer.render(this.scene, this.camera);
        // this.renderer.clear();
        // this.composer.render();

        requestAnimationFrame(this.render.bind(this));
    },

    flowWater: function(mesh, positions, time) {
        var vertices = mesh.geometry.vertices;
        for(var i = 0; i < vertices.length; i++) {
            this.theta += 0.03;
            vertices[i].z = positions[i] * Math.cos(time * 0.005 * (i + 1)) * 2;
        }
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeFaceNormals();
    },

    debug: function() {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.zIndex = '100';
        document.body.appendChild(this.stats.domElement);
    },

    initGui: function() {
        this.gui = new dat.GUI();

        var effects = this.gui.addFolder('Effects');
        effects.add(Constants, 'bloom').min(0).max(10).onChange(function(value) {
            this.bloomPass.copyUniforms[ "opacity" ].value = value;
        }.bind(this));
    }
};