module.exports = function(sequelize, DataTypes) {
  var Neighbor = sequelize.define("Neighbor", {
    // Giving the Neighbor model a name of type STRING
    name:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  },
    {
      classMethods: {
        associate: function(models) {
          Neighbor.hasMany(models.Request, {
            onDelete: "cascade"
          });
        }
      }
    }
  );
  return Neighbor;
};
