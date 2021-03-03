const dayjs = require('dayjs');

const generateId = (name) => {
	const id = name.trim().toLowerCase().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-');
	const number = Math.floor(100000 + Math.random() * 900000);
	return `${id}-${number}`;
};

module.exports = async (req, res) => {
	const { event } = req.body;

	try {
		const eventId = generateId(event.name);
		const currentTime = dayjs().unix();

		const entity = {
			key: req.datastore.key(['Event', eventId]),
			data: {
				name: event.name.trim(),
				created: currentTime,
				timezone: event.timezone,
				startTime: event.startTime,
				endTime: event.endTime,
				dates: event.dates,
			},
		};

		await req.datastore.insert(entity);

		res.status(201).send({
			id: eventId,
			name: event.name.trim(),
			created: currentTime,
			timezone:  event.timezone,
			startTime: event.startTime,
			endTime: event.endTime,
			dates: event.dates,
		});
	} catch (e) {
		console.error(e);
		res.sendStatus(400);
	}
};