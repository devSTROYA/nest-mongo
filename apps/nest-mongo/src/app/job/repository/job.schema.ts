import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;
export type JobMetadataDocument = HydratedDocument<JobMetadata>;
export type JobCommandStatusDocument = HydratedDocument<JobCommandStatus>;

@Schema()
export class JobMetadata {
  @Prop()
  type: string;
}

@Schema()
export class JobCommandStatus {
  @Prop()
  nodeId: string;

  @Prop()
  nodeIdentifier: string;

  @Prop()
  status: string;
  
  @Prop({ type: Date })
  updatedAt: Date;
}

@Schema()
export class Job {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  trialNo: number;

  @Prop()
  isAlertRaised: boolean;
  
  @Prop()
  isMultiTiered: boolean;
  
  @Prop()
  isCMSync: boolean;

  @Prop()
  targets: Array<string>;

  @Prop()
  status: string;

  @Prop()
  metaData: Array<JobMetadata>;

  @Prop()
  deleted: boolean;

  @Prop()
  commandStatus: Array<JobCommandStatus>;
  
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);