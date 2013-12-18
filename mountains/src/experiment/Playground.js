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
        this.resize = new Resize();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(45, this.resize.screenWidth / this.resize.screenHeight, 0.1, 10000);
        this.scene = new THREE.Scene();

        this.scene.add(this.camera);
        this.camera.position.z = 500;

        this.renderer.setSize(this.resize.screenWidth, this.resize.screenHeight);

        document.body.appendChild(this.renderer.domElement);

        this.quadNumbers = 20;
        this.planeGeometry = new THREE.PlaneGeometry(500, 500, this.quadNumbers, this.quadNumbers);
        this.planeMaterial = new THREE.MeshBasicMaterial({color: 0x0000CC, wireframe: true});
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.planeMesh.rotation.set(Constants.planeAngleX, Constants.planeAngleY, Constants.planeAngleZ);

        this.scene.add(this.planeMesh);

        var vertices = this.planeGeometry.vertices;

        var middleVerticeIndex = this.quadNumbers * this.quadNumbers / 2;

        for(var i = 0; i < this.quadNumbers; i++) {
            if(i % 2) {
                this.createMountain(this.quadNumbers + this.quadNumbers / 2 * i, this.planeGeometry.vertices, 120);
                this.createMountain(this.quadNumbers * this.quadNumbers - this.quadNumbers / 2 * i, this.planeGeometry.vertices, 120);
            }
        }
        this.createMountain(middleVerticeIndex, this.planeGeometry.vertices, 10);

        this.controls = new THREE.TrackballControls(this.camera);
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

    render: function()
    {
        if(this.isDebug)
        {
            this.stats.update();
        }

        this.controls.update();
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
        /*var planeAngle = this.gui.addFolder('planeAngle');
        planeAngle.open();
        planeAngle.add(Constants, 'planeAngleX').min(-Math.PI).max(Math.PI).step(0.01);
        planeAngle.add(Constants, 'planeAngleY').min(-Math.PI).max(Math.PI).step(0.01);
        planeAngle.add(Constants, 'planeAngleZ').min(-Math.PI).max(Math.PI).step(0.01);*/
    }
};