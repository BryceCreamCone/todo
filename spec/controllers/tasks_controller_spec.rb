require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  describe "#index" do
    it "should list the tasks in the database" do
      task1 = FactoryBot.create(:task)
      task2 = FactoryBot.create(:task)
      task1.update_attributes(title: "Something else")
      get :index
      expect(response).to have_http_status :success
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq 2
      response_ids = response_value.collect {|task| task["id"]}
      expect(response_ids).to eq([task1.id, task2.id])
    end
  end


  describe "#update" do
    it "should allow tasks to be marked as done" do
      task = FactoryBot.create(:task, done: false)
      put :update, params: {id: task.id, task: { done: true }}
      expect(response).to have_http_status :success
      task.reload
      expect(task.done).to be true
    end
  end


  describe "#create" do
    it "should allow tasks to be added to the database" do
      task1 = FactoryBot.create(:task)
      task2 = FactoryBot.create(:task)
      post :create, params: {task: {title: "Clean Computer"} }
      expect(response).to have_http_status :success
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value['title']).to eq("Clean Computer")
      expect(Task.last.title).to eq("Clean Computer")
    end
  end


  describe "#destroy" do
    it "allows a task to be deleted from the database" do
      task = FactoryBot.create(:task)
      delete :destroy, params: {id: task.id}
      expect(response).to have_http_status :success
      expect(Task.all.count).to eq 0
    end
  end

end
