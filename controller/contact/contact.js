const SendEmail = require("../../utils/sendMail");
const logger = require("../../utils/logger");
const ErrorResponse = require("../../utils/errorResponse");

exports.contactMessage = async (req, res, next) => {
	const { fullname, telephone, email, message } = req.body;
	console.log("The request is", req.body);

	try {
		if (!fullname) {
			return next(new ErrorResponse("Fullname is required", 400));
		}

		if (!email) {
			return next(new ErrorResponse("Email is required", 400));
		}

		if (!message) {
			return next(new ErrorResponse("Contact Message is required", 400));
		}

		const emailHTML = `
				<h1>Contact Message</h1>
				<h2>From: ${fullname}</h2>
				<p><strong>Email:</strong> ${email}</p>
				${telephone ? `<p><strong>Telephone:</strong> ${telephone}</p>` : ""}
				<p><strong>Message:</strong></p>
				<p>${message}</p>
			`;

		//sending the email
		const emailData = {
			to: "info@kenixwastesolutions.co.ke",
			from: process.env.SENDMAILAPIFROM,
			subject: `Contact Message from : ${fullname}`,
			html: emailHTML,
		};

		const response = await SendEmail(emailData)

		console.log("Response from send email", response)

		res.status(200).json({
			success: true,
			data: response,
			message: "Message sent successfully"
		})

	} catch (error) {
		logger.error(`Caught send contact error: ${JSON.stringify(error)}`);
		next(error);
	}
};
