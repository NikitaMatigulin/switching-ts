class ProductValidator {
  static validate(data) {
    const { title, description, price, article, image, user_id } = data;

    const errors = {};

    if (!title || typeof title !== "string" || title.trim() === "") {
      errors.title = "Title is required and must be a non-empty string.";
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      errors.description =
        "Description is required and must be a non-empty string.";
    }

    if (!price || typeof price !== "number" || price <= 0) {
      errors.price = "Price is required and must be a positive number.";
    }

    if (!article || typeof article !== "string" || article.trim() === "") {
      errors.article = "Article is required and must be a non-empty string.";
    }

    if (image && typeof image !== "string") {
      errors.image = "Image must be a string.";
    }

    if (!user_id || typeof user_id !== "number" || user_id <= 0) {
      errors.user_id = "User ID is required and must be a positive integer.";
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      isValid: isValid,
      error: errors,
    };
  }
}

module.exports = ProductValidator;
