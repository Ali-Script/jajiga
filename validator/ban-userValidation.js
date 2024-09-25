const Joi = require('joi');

const schema = Joi.object({
    reason: Joi.string().valid(
        "violation of Terms of Service",
        "spamming",
        "harassment or Abuse",
        "illegal Activities",
        "hacking or Security Breaches",
        "inappropriate Content",
        "impersonation",
        "fraudulent Activities",
        "multiple Account Abuse",
        "copyright Infringement")
});

module.exports = schema;