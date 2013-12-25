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
        this.planeMaterial = new THREE.MeshPhongMaterial({color: 0x2899EB, shading: THREE.FlatShading});

        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

        this.scene.add(this.planeMesh);

        var vertices = this.planeGeometry.vertices;

        var middleVerticeIndex = this.quadNumbers * this.quadNumbers / 2;
        for(var i = 0; i < this.quadNumbers; i++) {
            this.createMountain(this.quadNumbers * i + MathHelper.randInt(-10, 10), vertices, 50);
            if(i % 2) {
                this.createMountain(this.quadNumbers / 2 * i, vertices, 140);
                this.createMountain(this.quadNumbers * this.quadNumbers - this.quadNumbers / 2 * i, vertices, 150);
            }
        }

        this.updateGeometry(this.planeMesh.geometry);

        this.waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, this.quadNumbers, this.quadNumbers), new THREE.MeshPhongMaterial({color: 0x00FFCC, shading: THREE.FlatShading/*, transparent: true, opacity: 0.9*/}));
        this.scene.add(this.waterMesh);
        this.waterMesh.position.z = 5;
        for(i = 0; i < this.quadNumbers * this.quadNumbers; i++) {
            if(i%2) {
                this.createMountain(i, this.waterMesh.geometry.vertices, 20);
            }
        }

        this.waterPosition = [];

        vertices = this.waterMesh.geometry.vertices;
        for(i = 0; i < vertices.length; i++) {
            this.waterPosition.push(vertices[i].z);
        }

        this.updateGeometry(this.waterMesh.geometry);
    },

    updateGeometry: function(geometry) {
        geometry.computeFaceNormals();
    },

    initLights: function() {
        this.spotLight = new THREE.SpotLight(0xFFFFFF, 2, 10000);
        this.spotLight.castShadow = true;
        this.spotLight.position.x = 500;
        this.scene.add(this.spotLight);

        /*this.spotLightHelper = new THREE.Mesh(new THREE.SphereGeometry(10, 8, 8), new THREE.MeshBasicMaterial({color: 0x2899EB}));
        this.spotLightHelper.position = this.spotLight.position;
        this.scene.add(this.spotLightHelper);*/

        this.oppositeSpotLight = new THREE.SpotLight(0xEB2899, 2, 10000);
        this.oppositeSpotLight.castShadow = true;
        this.oppositeSpotLight.position.x = 500;
        this.scene.add(this.oppositeSpotLight);

        /*this.oppositeSpotLightHelper = new THREE.Mesh(new THREE.SphereGeometry(10, 8, 8), new THREE.MeshBasicMaterial({color: 0xEB2899}));
        this.oppositeSpotLightHelper.position = this.spotLight.position;
        this.scene.add(this.oppositeSpotLightHelper);*/

        this.ambientLight = new THREE.AmbientLight(0x121212);
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

        this.spotLight.position.set(100 * Math.cos(time) * 3, 100 * Math.sin(time) * 3, 100);
        // this.spotLightHelper.position = this.spotLight.position;

        this.oppositeSpotLight.position.set(100 * Math.cos(time + Math.PI) * 3, 100 * Math.sin(time + Math.PI) * 3, 100);
        // this.oppositeSpotLightHelper.position = this.oppositeSpotLight.position;

        this.flowWater(this.waterMesh, this.waterPosition, time);
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

    flowWater: function(mesh, positions, time) {
        var vertices = mesh.geometry.vertices;
        mesh.geometry.dynamic = true;
        mesh.geometry.mergeVertices();
        for(var i = 0; i < vertices.length; i++) {
            vertices[i].z = positions[i] + positions[i] * Math.cos(time) * Math.sin(time);
        }
        mesh.geometry.verticesNeedUpdate = true;
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

        // this.gui.addColor(Constants, 'firstLightColor').onChange(function(value) {
        //     this.pointLight.color = value;
        // }.bind(this));
    }
};