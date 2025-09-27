# Gender API Documentation

## Overview
This API allows you to predict the gender of a person based on their first name.

## Endpoints

### Predict Gender
- **URL**: `https://api.genderize.io`
- **Method**: GET
- **Parameters**:
  - `name` (string): The first name to predict gender for

## Usage
Call the `predict_gender` tool with a name parameter to get gender prediction results.

## Example
- Input: "John" → Returns gender prediction with probability
- Input: "Sarah" → Returns gender prediction with probability
