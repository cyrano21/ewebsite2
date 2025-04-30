import dbConnect from '../../utils/dbConnect';
import SponsorBanner from '../../models/SponsorBanner';

export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case 'GET':
      try {
        const banners = await SponsorBanner.find({}).sort({ order: 1 });
        res.status(200).json(banners);
      } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
      }
      break;
    case 'POST':
      try {
        const banner = new SponsorBanner(req.body);
        await banner.save();
        res.status(201).json(banner);
      } catch (error) {
        res.status(400).json({ error: 'Erreur création' });
      }
      break;
    case 'PUT':
      try {
        const { _id, ...update } = req.body;
        const banner = await SponsorBanner.findByIdAndUpdate(_id, update, { new: true });
        res.status(200).json(banner);
      } catch (error) {
        res.status(400).json({ error: 'Erreur modification' });
      }
      break;
    case 'DELETE':
      try {
        const { _id } = req.body;
        await SponsorBanner.findByIdAndDelete(_id);
        res.status(204).end();
      } catch (error) {
        res.status(400).json({ error: 'Erreur suppression' });
      }
      break;
    default:
      res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
