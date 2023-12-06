import { BadRequestException, Body, Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, Res } from '@nestjs/common';
import { CreateJobUseCase } from '../../usecase/create-job.usecase';
import { CreateJobDTO } from '../../job/dto/create-job.dto';
import { JobErrors } from '../../usecase/job.error';
import { isLeft } from 'fp-ts/Either';
import { FindJobUseCase } from '../../usecase/find-job.usecase';
import { FindJobDTO } from '../../job/dto/find-job.dto';
import { UpdateJobDTO } from '../../job/dto/update-job.dto';
import { UpdateJobUseCase } from '../../usecase/update-job.usecase';
import { Request, Response } from 'express'

@Controller('command')
export class AppController {
  constructor(
    private readonly createJob: CreateJobUseCase,
    private readonly findJob: FindJobUseCase,
    private readonly updateJob: UpdateJobUseCase,
  ) {}

  @Post()
  async create(
    @Body() body: CreateJobDTO
  ) {
    const result = await this.createJob.execute(body);
    if (isLeft(result)) {
      const error = result.left;

      switch (error.constructor) {
        case JobErrors.JobNotFound:
          throw new BadRequestException({ message: error.message });
        case JobErrors.NodeNotFound:
          throw new BadRequestException({ message: error.message });
        case JobErrors.ParameterMissing:
          throw new BadRequestException({ message: error.message });
        default:
          throw new InternalServerErrorException({ message: error.message });
      }
    }

    return result.right;
  }

  @Get(':jobId')
  async findById(
    @Param() param: FindJobDTO
  ) {
    const result = await this.findJob.execute(param);
    if (isLeft(result)) {
      const error = result.left;

      switch (error.constructor) {
        case JobErrors.JobNotFound:
          throw new BadRequestException({ message: error.message });
        default:
          throw new InternalServerErrorException({ message: error.message });
      }
    }

    return result.right;
  }

  @HttpCode(204)
  @Put()
  async update(
    @Body() body: UpdateJobDTO,
    @Res()  res: Response,
    @Req()  req: Request,
  ) {
    const result = await this.updateJob.execute(body);
    if (isLeft(result)) {
      const error = result.left;

      switch (error.constructor) {
        case JobErrors.JobNotFound:
          throw new BadRequestException({ message: error.message });
        case JobErrors.JobAlreadyCompleted:
          return res.status(200).send({ jobId: body.jobId, status: body.status});
        default:
          throw new InternalServerErrorException({ message: error.message });
      }
    }

    return res.status(204).send(result.right);
  }
}