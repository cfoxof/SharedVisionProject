class CreateBoards < ActiveRecord::Migration
  def self.up
    create_table :boards do |t|
      t.string :name
      t.integer :height
      t.integer :width

      t.timestamps
    end
  end

  def self.down
    drop_table :boards
  end
end
