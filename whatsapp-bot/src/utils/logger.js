const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  log(level, message, meta) {
    if (logLevels[level] <= logLevels[this.level]) {
      const formattedMessage = this.formatMessage(level, message, meta);

      if (level === 'error') {
        console.error(formattedMessage);
      } else if (level === 'warn') {
        console.warn(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  // Enhanced colored debugging methods
  debugFreelancers(message, freelancers) {
    if (logLevels['debug'] <= logLevels[this.level]) {
      console.log('\x1b[34m%s\x1b[0m', `🔍 [FREELANCERS DEBUG] ${message}`); // Blue
      if (freelancers && freelancers.length > 0) {
        freelancers.forEach((freelancer, index) => {
          console.log('\x1b[36m%s\x1b[0m', `  ${index + 1}. ${freelancer.full_name} (${freelancer.field})`); // Cyan
          if (freelancer.profiles) {
            console.log('\x1b[32m%s\x1b[0m', `     Profile: ${JSON.stringify(freelancer.profiles)}`); // Green
          }
          if (freelancer.projects && freelancer.projects.length > 0) {
            console.log('\x1b[33m%s\x1b[0m', `     Projects: ${freelancer.projects.length} projects`); // Yellow
          }
        });
      } else {
        console.log('\x1b[31m%s\x1b[0m', '  ❌ No freelancers found'); // Red
      }
    }
  }

  debugSupabase(message, data) {
    if (logLevels['debug'] <= logLevels[this.level]) {
      console.log('\x1b[35m%s\x1b[0m', `📊 [SUPABASE DEBUG] ${message}`); // Magenta
      if (data) {
        console.log('\x1b[37m%s\x1b[0m', `  Data: ${JSON.stringify(data, null, 2)}`); // White
      }
    }
  }

  debugAnalysis(message, analysis) {
    if (logLevels['debug'] <= logLevels[this.level]) {
      console.log('\x1b[33m%s\x1b[0m', `🧠 [ANALYSIS DEBUG] ${message}`); // Yellow
      if (analysis) {
        console.log('\x1b[37m%s\x1b[0m', `  Analysis: ${JSON.stringify(analysis, null, 2)}`); // White
      }
    }
  }

  error(message, meta) {
    this.log('error', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
