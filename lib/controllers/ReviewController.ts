import ReviewModel from "@/models/Review";
import UserModel from "@/models/User";
import { connectToDatabase } from "@/lib/controllers/db";
import type { ReviewDto } from "@/types/api";

function docToReviewDto(
  doc: { _id: unknown; presetId: unknown; userId: unknown; score: number; comment?: string; createdAt?: Date },
  user?: { name?: string; image?: string } | null
): ReviewDto {
  return {
    _id: String(doc._id),
    presetId: String(doc.presetId),
    userId: String(doc.userId),
    userName: user?.name ?? null,
    userImage: user?.image ?? null,
    score: doc.score,
    comment: doc.comment ?? null,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString()
  };
}

export class ReviewController {
  async create(presetId: string, userId: string, body: { score: number; comment?: string }) {
    await connectToDatabase();
    const { score, comment } = body;
    if (typeof score !== "number" || score < 1 || score > 5) {
      throw new Error("Score must be between 1 and 5");
    }
    const doc = await ReviewModel.findOneAndUpdate(
      { presetId, userId },
      { score, comment: comment ?? "" },
      { upsert: true, new: true }
    )
      .lean()
      .exec();
    const user = await UserModel.findById(userId).lean().exec();
    return docToReviewDto(doc as Parameters<typeof docToReviewDto>[0], user);
  }

  async getByPresetId(presetId: string): Promise<ReviewDto[]> {
    await connectToDatabase();
    const docs = await ReviewModel.find({ presetId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const userIds = [...new Set(docs.map((d) => String(d.userId)))];
    const users = await UserModel.find({ _id: { $in: userIds } })
      .lean()
      .exec();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));
    return docs.map((d) => {
      const dDoc = d as Parameters<typeof docToReviewDto>[0] & { userId: unknown };
      return docToReviewDto(dDoc, userMap[String(dDoc.userId)]);
    });
  }

  async getByUserId(userId: string): Promise<ReviewDto[]> {
    await connectToDatabase();
    const docs = await ReviewModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const user = await UserModel.findById(userId).lean().exec();
    return docs.map((d) => docToReviewDto(d as Parameters<typeof docToReviewDto>[0], user));
  }
}

export const reviewController = new ReviewController();
