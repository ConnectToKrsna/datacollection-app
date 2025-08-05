import dbConnect from '../../lib/dbConnect';
import Registration from '../../models/Registration';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newEntry = new Registration({
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      area: body.area || '',
      remarks: body.remarks || '',
    });

    await newEntry.save();

    return Response.json({ message: 'successful!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Error saving data' }, { status: 500 });
  }
}
