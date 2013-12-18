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
        this.initRenderer();

        this.quadNumbers = 20;

        this.initMeshes();
        this.initLights();

        this.controls = new THREE.TrackballControls(this.camera);
    },

    initRenderer: function() {
        this.resize = new Resize();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(45, this.resize.screenWidth / this.resize.screenHeight, 0.1, 10000);
        this.scene = new THREE.Scene();

        this.scene.add(this.camera);
        this.camera.position.z = 500;

        this.renderer.setSize(this.resize.screenWidth, this.resize.screenHeight);

        this.renderer.shadowMapEnabled = true;

        document.body.appendChild(this.renderer.domElement);
    },

    initMeshes: function() {
        this.planeGeometry = new THREE.PlaneGeometry(500, 500, this.quadNumbers, this.quadNumbers);
        // this.planeMaterial = new THREE.MeshLambertMaterial({color: 0x0000CC});
        // this.planeMaterial = new THREE.MeshLambertMaterial({color: 0x111111});
        this.planeMaterial = new THREE.MeshPhongMaterial({ambient: 0xCCCCCC, color: 0xCCCCCC, specular: 0xBBBBCC, shininess: 50, shading: THREE.SmoothShading});

        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        // this.lineMesh = new THREE.Mesh(this.planeGeometry, new THREE.MeshBasicMaterial({color: 0x00CCCC, wireframe: true}));
        // this.lineMesh.position.z = -1;

        this.planeMesh.castShadow = true;
        this.planeMesh.receiveShadow = false;

        this.scene.add(this.planeMesh);
        // this.scene.add(this.lineMesh);

        var vertices = this.planeGeometry.vertices;

        var middleVerticeIndex = this.quadNumbers * this.quadNumbers / 2;

        for(var i = 0; i < this.quadNumbers; i++) {
            this.createMountain(this.quadNumbers * i + MathHelper.randInt(-10, 10), vertices, 30);
            if(i % 2) {
                this.createMountain(this.quadNumbers / 2 * i, vertices, 120);
                this.createMountain(this.quadNumbers * this.quadNumbers - this.quadNumbers / 2 * i, vertices, 120);
            }
        }
    },

    initLights: function() {
        this.spotLight = new THREE.SpotLight(0xDCAF00);
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);

        this.ambientLight = new THREE.AmbientLight(0x221100);
        this.ambientLight.z = 150;
        this.scene.add(this.ambientLight);
    },

    createMountain: function(startVertice, vertices, maxHeight) {
        var peakNumber = ~~(MathHelper.rand(3, 8));

        for(var i = 0; i < peakNumber; i++) {
            if(vertices[startVertice + i]) vertices[startVertice + i].z = MathHelper.max(0, MathHelper.randInt(maxHeight / 3, maxHeight - MathHelper.randInt(maxHeight / 3, i * 10)));
            if(vertices[startVertice - i]) vertices[startVertice - i].z = MathHelper.max(0, MathHelper.randInt(maxHeight / 3, maxHeight - MathHelper.randInt(maxHeight / 3, i * 10)));
            if(vertices[startVertice - i - this.quadNumbers]) vertices[startVertice - i - this.quadNumbers].z = MathHelper.max(0, MathHelper.randInt(maxHeight / 3, maxHeight - MathHelper.randInt(maxHeight / 3, i * 10)));
            if(vertices[startVertice + i + this.quadNumbers]) vertices[startVertice + i + this.quadNumbers].z = MathHelper.max(0, MathHelper.randInt(maxHeight / 3, maxHeight - MathHelper.randInt(maxHeight / 3, i * 10)));

            maxHeight *= 5/6;
        }
    },

    customRender: function() {
        var time = Date.now() * 0.0005;

        this.spotLight.position.set(Constants.spotLightX, Constants.spotLightY, Constants.spotLightZ);
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

        requestAnimationFrame(this.render.bind(this));
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
        /*var spotLight = this.gui.addFolder('spotLight');
        spotLight.open();
        spotLight.add(Constants, 'spotLightX').min(-200).max(200);
        spotLight.add(Constants, 'spotLightY').min(-200).max(200);
        spotLight.add(Constants, 'spotLightZ').min(-200).max(200);*/
        /*var planeAngle = this.gui.addFolder('planeAngle');
        planeAngle.open();
        planeAngle.add(Constants, 'planeAngleX').min(-Math.PI).max(Math.PI).step(0.01);
        planeAngle.add(Constants, 'planeAngleY').min(-Math.PI).max(Math.PI).step(0.01);
        planeAngle.add(Constants, 'planeAngleZ').min(-Math.PI).max(Math.PI).step(0.01);*/
    }
};