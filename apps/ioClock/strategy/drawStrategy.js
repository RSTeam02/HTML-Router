export class DrawStrategy{
	
	constructor(drawStrategy){
		this.drawStrategy = drawStrategy;
	}

	executeStrategy(obj){
		this.drawStrategy.draw(obj);
	}

}
