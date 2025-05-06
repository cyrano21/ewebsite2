import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["positive", "frequent", "inactive", "specific"],
      required: true,
    },
    targetUserCount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "scheduled", "in_progress", "completed", "failed"],
      default: "created",
    },
    statistics: {
      emailsSent: {
        type: Number,
        default: 0,
      },
      emailsOpened: {
        type: Number,
        default: 0,
      },
      emailsClicked: {
        type: Number,
        default: 0,
      },
      productViews: {
        type: Number,
        default: 0,
      },
      conversions: {
        type: Number,
        default: 0,
      },
    },
    completedAt: {
      type: Date,
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);

export default Campaign;