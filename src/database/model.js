const { db } = require("./database");

class Model {
    constructor(tableName) {
        this.tableName = tableName;
        this.params = {
            tableName: tableName
        }
    }

    getParams() {
        return {
            ...this.params
        }
    }

    async create(item) {
        const database = db();
        const params = this.getParams();
        params.Item = item;

        database.put(params, (err, data) => {
            if(err) return err;
            return data;
        });
    }

    async findOne(key) {
        const database = db();
        const params = this.getParams();
        params.Key = key;

        database.get(params, (err, data) => {
            if (err) return err;
            return data
        });
    }

    async findAll() {
        // TODO: implement generic fillAll method
    }

    async updateOne(key) {
        const database = db();
        const params = this.getParams();

        params = {
            ...params,
            Key: key,
            UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
            ExpressionAttributeValues: {
                ":byUser": "updateUser",
                ":boolValue": true
            },
            returnValues: true
        }

        database.update(params, (err, data) => {
            if (err) return err;
            return data;
        })

    }

    async delete(key) {
        // TODO: implement generic delete method
    }

}

module.exports = Model;