import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    // ConfigModule - load .env variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI),

    // GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Auto-generate schema
      sortSchema: true,
      playground: true, // GraphQL Playground UI
      context: ({ req, res }) => ({ req, res }), // Pass request/response to resolvers
    }),

    // Feature modules sẽ import sau (MenuModule, AuthModule, etc.)
  ],
  providers: [AppResolver], // Test resolver
})
export class AppModule {}
