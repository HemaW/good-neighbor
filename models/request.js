module.exports = function(sequelize, DataTypes) {
  var Request = sequelize.define("Request", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    }
  },
    {
      classMethods: {
        associate: function(models) {
          Request.belongsTo(models.Neighbor, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );
  return Request;
};
