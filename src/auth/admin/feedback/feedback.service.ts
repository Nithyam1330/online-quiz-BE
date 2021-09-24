import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from 'src/auth/user/user.service';
import { MODAL_ENUMS } from 'src/shared/enums/models.enums';
import { ApplicationsService } from '../applications/applications.service';
import { CreateFeedbackDto } from './feedback.dto';
import { IFeedbackDocument } from './feedback.schema';

@Injectable()
export class FeedbackService {
    constructor(
        @Inject(MODAL_ENUMS.FEEDBACK) private readonly feedbackModel: Model<IFeedbackDocument>,
        private usersService: UserService,
        private applicationService: ApplicationsService

    ) { }

    async submitFeedback(feedbackPalyload: CreateFeedbackDto): Promise<CreateFeedbackDto | UnprocessableEntityException> {
            let alreadySubmitted = await this.feedbackModel.find({userId: feedbackPalyload.userId, applicationId: feedbackPalyload.applicationId}).exec();
            await this.usersService.isValidUserId(feedbackPalyload.userId);
            await this.applicationService.isValidApplicationId(feedbackPalyload.applicationId);
            if(alreadySubmitted && alreadySubmitted.length) {
                throw new HttpException(`Feedback already Submitted`, HttpStatus.NOT_MODIFIED);
            }
            const feedback = new this.feedbackModel(feedbackPalyload);
            return feedback.save();
    }

    async getAllFeedbacks(): Promise<any | UnprocessableEntityException> {
        try {
            const feedbackDetails = await this.feedbackModel.find().exec();
            let userIds = feedbackDetails.map(feedback => feedback.userId);
            let userDetails = await this.usersService.getUsersByIds(userIds);
            let applicationIds = feedbackDetails.map(feedback => feedback.applicationId);
            let applicationDetails = await this.applicationService.getAllApplicationsByIds(applicationIds);
            return {feedbackDetails, userDetails, applicationDetails};
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllFeedbacksByUserId(userId: string): Promise<any | UnprocessableEntityException> {
        try {
            const feedbackDetails = await this.feedbackModel.find({userId: userId}).exec();
            let applicationIds = feedbackDetails.map(feedback => feedback.applicationId);
            let applicationDetails = await this.applicationService.getAllApplicationsByIds(applicationIds);
            return {feedbackDetails, applicationDetails};
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async getAllFeedbacksByApplicationId(applicationId: string): Promise<any | UnprocessableEntityException> {
        try {
            const feedbackDetails = await this.feedbackModel.find({applicationId: applicationId}).exec();
            let userIds = feedbackDetails.map(feedback => feedback.userId);
            let userDetails = await this.usersService.getUsersByIds(userIds);
            return {feedbackDetails, userDetails,};
        }
        catch (e) {
            throw new HttpException(`Something went wrong ... Please try again`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async deleteFeedback(feedbackId: string): Promise<IFeedbackDocument | NotFoundException | UnprocessableEntityException> {
        const result = await this.feedbackModel.findByIdAndDelete(feedbackId).exec();
        if (!result) {
            throw new HttpException('Nothing has Deleted', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async updateFeedback(feedbackPayload: CreateFeedbackDto, _id: string): Promise<CreateFeedbackDto | UnprocessableEntityException | NotFoundException> {
        await this.usersService.isValidUserId(feedbackPayload.userId);
        await this.applicationService.isValidApplicationId(feedbackPayload.applicationId);
        const feedbackDetails = await this.feedbackModel.findOneAndUpdate({ _id: _id }, feedbackPayload).exec();
        if (!feedbackDetails) {
            throw new HttpException('Nothing has changed', HttpStatus.NOT_MODIFIED);
        }
        return feedbackPayload;
    }

    async getFeedbackById(id: string): Promise<CreateFeedbackDto | NotFoundException> {
        const feedbackDetails = await this.feedbackModel.findOne({ _id: id}).exec();
        if (!feedbackDetails) {
            throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
        }
        return feedbackDetails;
    }
}
