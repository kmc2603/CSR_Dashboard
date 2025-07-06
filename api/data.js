export default async function handler(req, res) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_URL = "https://api.airtable.com/v0/app7fpeg0ILdGtaVh/tblXAHReqUwulhpel";

  try {
    const response = await fetch(AIRTABLE_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`
      }
    });
    const json = await response.json();
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
