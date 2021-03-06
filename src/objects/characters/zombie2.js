import ZombieA from '../../utilities/zombiea.js'
export default class ZombieGenerator extends Phaser.Physics.Arcade.Group{
    constructor(scene,texture){
        super(scene.physics.world,scene)
        this.texture = texture;
        this.generatePosition = {
            x: 50,
            y:50
        } 
    }

    createZombie(x,y){
        let newZombie = new Zombie2(this.scene,x+25,y+25,this.texture);
        this.add(newZombie);
    }
    findPlayer(){
        this.getChildren().forEach(z=>{
            z.findPlayer();
        })
    }
}

class Zombie2 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.anims.create({
            key: `${texture}-left`,
            frames: scene.anims.generateFrameNumbers(texture, { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: `${texture}-turn`,
            frames: [{ key: texture, frame: 0 }],
            frameRate: 20
        });

        scene.anims.create({
            key: `${texture}-right`,
            frames: scene.anims.generateFrameNumbers(texture, { start: 10, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.stepPerTurn = 1;
        this.stepInTurn = 0;
        this.isTurning = false;
        this.right = true;
        this.setCollideWorldBounds(true);
        this.velocity = 100; 
        this.ai = new ZombieA();
        this.directions = [];
        this.moveTo = this.scene.plugins.get('rexMoveTo').add(this, {
            speed: 400
        });
        this.moveTo.on('complete',(gameObject, moveTo)=>{
            this.move();
        });
    }
    findPlayer() {
        let currentPos = {
            x: Math.floor(this.x/50),
            y: Math.floor(this.y/50)
        };
        currentPos = this.directions ? currentPos : this.directions[this.directions.length - 1] ;
        let playerPos = {
            x: Math.floor(this.scene.player.x/50),
            y: Math.floor(this.scene.player.y/50)
        }
        this.ai.getDirection(currentPos,playerPos).reverse().forEach(dir => {
            this.directions.push(dir);
        });
        this.move();
        
    }
    move(){
        let pos = {};
        if(this.stepInTurn < this.stepPerTurn) {
            pos = this.directions.shift();
            console.log(pos);
            this.stepInTurn++;
            this.moveTo.moveTo(pos.x*50+25,pos.y*50+25);
        }else{
            console.log(this.directions.length);
            this.stepInTurn = 0;
            this.scene.player.isTurning = true;
            this.anims.play(`${this.texture.key}-turn`,true);
        }
    }
    trackLeftOrRight(){
        if(this.right){
            this.anims.play(`${this.texture.key}-right`,true);
        }else{
            this.anims.play(`${this.texture.key}-left`,true);
        }
    }
}

