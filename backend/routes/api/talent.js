/** Using GraphQL */
/** Setup of database */
const express = require('express');
//var { buildSchema, graphql } = require('graphql');
const graphql = require("graphql")
const { RowDescriptionMessage } = require('pg-protocol/dist/messages');
const pgp = require('pg-promise')();
const {SQL_DATABASE_URL} = require('./../../ config')
const connectionString = {
    connectionString: SQL_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}
const db = {}
db.conn = pgp(connectionString)

/**TODO: Make a schema for Talent that can retrieve everything */
/** Schema for a talent */

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} = graphql;


/** Using GraphQL */


var talentType = new graphql.GraphQLObjectType({
    name: 'Talent',
    fields: {
        full_name: {type: GraphQLString},
        email: {type: GraphQLString},
        resume: {type: GraphQLString},
        url: {type: GraphQLString},
        linkedin: {type: GraphQLString},
        location: {type: GraphQLString},
        country: {type: GraphQLString},
    }
});

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: talentType,
            args: {
                email: {type: graphql.GraphQLString}
            },
            resolve: (_, {email}) => {
                const query = 'SELECT * FROM talent WHERE email = \'' + email + "\';";
                return db.conn.one(query)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return 'The following error occured: ', err;
                })
            }
        },
        users: {
            type: new graphql.GraphQLList(talentType),
            resolve: (_, {}) => {
                const query = 'SELECT * FROM talent;'
                return db.conn.many(query)
                .then(data => {
                    console.log("This is the list data")
                    return data 
                })
            }
        }

    }
})
module.exports = {
    graphQLSchema : new graphql.GraphQLSchema({query: queryType}),
}
