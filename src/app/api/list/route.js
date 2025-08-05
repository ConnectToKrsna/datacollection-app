import dbConnect from '../../lib/dbConnect';
import Registration from '../../models/Registration';

export async function GET() {
  try {
    await dbConnect();
    const entries = await Registration.find({});
    return Response.json({ entries }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Failed to fetch data' }, { status: 500 });
  }
}
