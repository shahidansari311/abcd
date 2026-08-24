import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.4,
  },
  headerContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  headline: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 6,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#666666',
  },
  contactItem: {
    marginRight: 10,
  },
  link: {
    color: '#0056b3',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 6,
  },
  itemContainer: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
  },
  itemSubtitle: {
    fontFamily: 'Helvetica-Oblique',
    color: '#444444',
  },
  itemDate: {
    color: '#666666',
    fontSize: 9,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
  },
  skillsText: {
    lineHeight: 1.5,
  }
});

type Experience = { company: string; title: string; startDate: string; endDate: string; description: string };
type Project = { title: string; description: string; link: string };
type Education = { institution: string; degree: string; fieldOfStudy: string; startDate: string; endDate: string };
type Skill = { name: string; score: number };

export type ResumeData = {
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string; 
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  certifications?: string[];
  skills?: Skill[];
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const BulletList = ({ text }: { text?: string }) => {
  if (!text) return null;
  // Try to split by newline first. If no newlines, maybe split by periods followed by space.
  let points = text.split('\n').filter(p => p.trim().length > 0);
  
  if (points.length === 1 && text.includes('. ')) {
      points = text.split('. ').map(p => p.trim() + (p.endsWith('.') ? '' : '.')).filter(p => p.trim().length > 1);
  }

  return (
    <View>
      {points.map((point, i) => (
        <View key={i} style={styles.bulletPoint}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{point.replace(/^[-•*]\s*/, '')}</Text>
        </View>
      ))}
    </View>
  );
};

export const ResumeDocument = ({ data }: { data: ResumeData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{data.firstName} {data.lastName}</Text>
          {data.headline && <Text style={styles.headline}>{data.headline}</Text>}
          
          <View style={styles.contactInfo}>
            {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
            {data.linkedin && (
              <Link src={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} style={[styles.link, styles.contactItem]}>
                LinkedIn
              </Link>
            )}
            {data.github && (
              <Link src={data.github.startsWith('http') ? data.github : `https://${data.github}`} style={[styles.link, styles.contactItem]}>
                GitHub
              </Link>
            )}
            {data.portfolio && (
              <Link src={data.portfolio.startsWith('http') ? data.portfolio : `https://${data.portfolio}`} style={[styles.link, styles.contactItem]}>
                Portfolio
              </Link>
            )}
          </View>
        </View>

        {/* SUMMARY */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.paragraph}>{data.summary}</Text>
          </View>
        )}

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.skillsText}>
              {data.skills.map(s => s.name).join(' • ')}
            </Text>
          </View>
        )}

        {/* EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title} <Text style={styles.itemSubtitle}>| {exp.company}</Text></Text>
                  <Text style={styles.itemDate}>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</Text>
                </View>
                <BulletList text={exp.description} />
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, i) => (
              <View key={i} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {proj.title}
                    {proj.link && <Text style={{ fontFamily: 'Helvetica' }}> - <Link src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={styles.link}>Link</Link></Text>}
                  </Text>
                </View>
                <BulletList text={proj.description} />
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.institution}</Text>
                  <Text style={styles.itemDate}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.degree} in {edu.fieldOfStudy}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, i) => (
              <View key={i} style={styles.bulletPoint}>
                 <Text style={styles.bulletDot}>•</Text>
                 <Text style={styles.bulletText}>{cert}</Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
};
