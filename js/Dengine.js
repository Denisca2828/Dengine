var engine = {
	math: {
		fps: _fps => {return _fps == "max" ? 0 : 1000 / _fps},
		toRad: _angle => {return _angle * Math.PI / 180}
	},
	init: ()=>{
		let temp = document.createElement("style");
		temp.innerText = `*{padding:0;margin:0;overflow:hidden;}`;
		document.head.appendChild(temp);
	}
}

class Vector{
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
}

const objects = {
	"square": ()=>{
		var temp = [];
		temp.push([-1, -1]);
		temp.push([-1, 1]);
		temp.push([1, 1]);
		temp.push([1, -1]);
		return temp;
	},
	"arc": quality => {
		let temp = [];
		let oa = 360 / quality;
		for(var i = 0;i < quality;i++){
			let a = engine.math.toRad(i * oa);
			temp.push([Math.cos(a), Math.sin(a)]);
		}
		return temp;
	}
};

class Object{
	position = new Vector()
	size = new Vector(1, 1)
	rotation = 0
	scale = 1
	fill = false
	color = "#000000"
	polygons = [] // [...[-1, -1]...]
	polygonal = [] // [...Vector(-1, -1)...]
	calculate(){
		this.polygonal = [];
		for(let _i of this.polygons) this.polygonal.push(new Vector(_i[0] * this.size.x * this.scale, _i[1] * this.size.y * this.scale));
	}
}

class Camera{
	position = new Vector()
	scale = new Vector(1, 1)
	rotation = 0
}

class Screen{
	camera = new Camera()
	constructor(size){
		this.width = size[0];
		this.height = size[1];
		let temp = document.createElement("canvas");
		temp.width = size[0];
		temp.height = size[1];
		temp.id = `screen_${size[0]}_${size[1]}`;
		document.body.appendChild(temp);
		this._cvs = document.getElementById(temp.id);
		this._ctx = this._cvs.getContext("2d");
	}
	clear(){
		this._ctx.clearRect(0, 0, this.width, this.height);
	}
	fill(color){
		this._ctx.fillStyle = color;
		this._ctx.fillRect(0, 0, this.width, this.height);
	}
	point(pos){
		this._ctx.beginPath();
		this._ctx.arc(pos.x, pos.y, 2, 0, 7);
		this._ctx.fill();
		this._ctx.beginPath();
	}
	line(pos1, pos2){
		this._ctx.beginPath();
		this._ctx.moveTo(pos1.x, pos1.y);
		this._ctx.lineTo(pos2.x, pos2.y);
		this._ctx.stroke();
		this._ctx.beginPath();
	}
	drawGO(GO){
		GO.calculate();
		var x2 = GO.position.x - this.camera.position.x;
		var y2 = GO.position.y - this.camera.position.y;
		this._ctx.strokeStyle = GO.color;
		this._ctx.fillStyle = GO.color;
		this._ctx.save();
		let w2 = GO.size.x / 2;
		let h2 = GO.size.y / 2;
		this._ctx.translate(x2 - w2, y2 - h2);
		this._ctx.translate(w2, h2);
		this._ctx.rotate(engine.math.toRad(GO.rotation - this.camera.rotation));
		let lines = [];
		let points = [];
		for(let i in GO.polygonal){
			var pos = GO.polygonal[i];
			var pos1 = pos;
			pos1.x *= this.camera.scale.x
			pos1.y *= this.camera.scale.y
			this.point(pos);
			points.push(pos);
		}
		for(let i in points){
			var pos = points[i];
			if(points[i-1] != undefined) lines.push([points[i-1], pos]);
		}
		lines.push([points[0], points[points.length-1]]);
		for(let i of lines){
			this.line(i[0], i[1]);
		}
		this._ctx.restore();
	}
}