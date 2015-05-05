class TodosController < ApplicationController
  def index
  	@todos = Todo.all
  	@todo = Todo.new

  	respond_to do |format|
  		format.html
  		format.json { render json: @todos }
  	end
  end

  def create
  	@todo = Todo.create(params.require(:todo).permit(:content))

  	respond_to do |f|
  		f.html
  		f.json { render json: @todo }
  	end
  end

  def destroy
  	todo = Todo.find(params[:id])
  	todo.destroy()

  	respond_to do |format|
  		format.html { redirect_to todos_path }
  		format.json { render json: nil, status: 200 }
  	end
  end

  def update
  	@todo = Todo.find(params[:id])
  	@todo.update_attributes(params.require(:todo).permit(:completed, :content))

  	respond_to do |format|
  		format.html
  		format.json { render json: @todo }
  	end
  end

end
