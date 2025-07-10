# Wedding Speech Generator

A beautiful web application that generates personalized best man, bridesmaid, and other wedding speeches using Anthropic's Claude AI.

## Features

- 🎤 Generate speeches for Best Man, Bridesmaid, Maid of Honor, and Groomsman
- 💝 Personalized content based on couple details and personal stories
- 🎨 Beautiful, modern UI with responsive design
- 📝 Customizable tone and length options
- 📋 Copy-to-clipboard functionality
- 💡 Helpful tips for speech delivery

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Anthropic API key:**
   - Get your API key from [Anthropic Console](https://console.anthropic.com/)
   - Create a `.env.local` file in the root directory
   - Add your API key:
     ```
     ANTHROPIC_API_KEY=your_api_key_here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Select speech type:** Choose from Best Man, Bridesmaid, Maid of Honor, or Groomsman
2. **Fill in couple details:** Enter the groom's and bride's names
3. **Describe your relationship:** Explain your connection to the couple
4. **Add personal stories:** Share memorable anecdotes and experiences
5. **Choose tone and length:** Select the desired style and duration
6. **Generate speech:** Click the button to create your personalized speech
7. **Copy and practice:** Use the copy button to save your speech

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API
- **Deployment:** Ready for Vercel deployment

## Tips for Great Speeches

- Practice your speech multiple times
- Keep it under 5 minutes
- Include specific details about the couple
- Balance humor with sentimentality
- Speak slowly and clearly
- Make eye contact with the audience
- Use pauses for emphasis
- End with a memorable toast

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude access |

## License

MIT License - feel free to use this project for your own wedding speeches!
