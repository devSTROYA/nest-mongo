import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Job, JobSchema } from './job/repository/job.schema';
import { CreateJobUseCase } from './usecase/create-job.usecase';
import { JobRepository } from './job/repository/job.repository';
import { InMemoryNodeRepository } from './node/repository/in-memory/in-memory-node.repository';
import { NodeRepository } from './node/repository/node.repository';
import { MongoDBJobRepository } from './job/repository/mongodb/mongodb-job.repository';
import { AppController } from './presenter/http/app.controller';
import { FindJobUseCase } from './usecase/find-job.usecase';
import { UpdateJobUseCase } from './usecase/update-job.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGOOSE_SRV')
      })
    }),
    MongooseModule.forFeature([
      {
        name: 'Job',
        schema: JobSchema
      }
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: NodeRepository,
      useClass: InMemoryNodeRepository,
    },
    {
      provide: JobRepository,
      useClass: MongoDBJobRepository,
    },
    CreateJobUseCase,
    FindJobUseCase,
    UpdateJobUseCase,
  ],
})
export class AppModule {}
