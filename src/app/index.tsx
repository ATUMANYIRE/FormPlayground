
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Checkbox from "expo-checkbox";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

type Values = Record<string, any>;

const C = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  field: "#F8FAFC",
  border: "#E2E8F0",
  text: "#000000",
  muted: "#1f0241",
  accent: "#7C3AED",
  green: "#059669",
  red: "#E11D48",
};

const initialValues: Values = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  website: "",
  search: "",
  bio: "",
  address: "",
  city: "",
  country: "Rwanda",
  age: "",
  quantity: "1",
  price: "",
  percentage: "50",
  otp: "",
  notes: "",
  readonly: "Read-only example",
  disabled: "Disabled example",
  department: "engineering",
  framework: "react",
  gender: "",
  contactMethod: "email",
  priority: "normal",
  skills: ["React Native"],
  newsletter: true,
  terms: false,
  notifications: true,
  marketing: false,
  progress: 40,
  rangeStart: 20,
  rangeEnd: 80,
  rating: 4,
  color: "#7C3AED",
  date: new Date(2005, 0, 1),
  time: new Date(2026, 0, 1, 12, 30),
  tags: ["expo", "forms"],
  coordinates: "",
  duration: "30",
  captcha: "",
  creditCard: "",
  cardExpiry: "",
  cardCvv: "",
  markdown: "",
};

const SKILLS = [
  "React Native",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
];

function Field({
  label,
  description,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  description?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={S.field}>
      <Text style={S.label}>
        {label}
        {required ? <Text style={S.error}> *</Text> : null}
      </Text>
      {description ? (
        <Text style={S.description}>{description}</Text>
      ) : null}
      {children}
      {error ? (
        <Text style={S.error}>{error}</Text>
      ) : hint ? (
        <Text style={S.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  editable = true,
  maxLength,
  autoCapitalize = "none",
}: {
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  multiline?: boolean;
  editable?: boolean;
  maxLength?: number;
  autoCapitalize?: any;
}) {
  return (
    <TextInput
      value={String(value ?? "")}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      editable={editable}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
      style={[
        S.input,
        multiline && S.multiline,
        !editable && S.disabled,
      ]}
    />
  );
}

function Action({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        S.button,
        secondary && S.secondaryButton,
        disabled && { opacity: 0.45 },
      ]}
    >
      <Text
        style={[
          S.buttonText,
          secondary && { color: C.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View style={S.section}>
      <View style={S.sectionHeading}>
        <View style={S.sectionNumber}>
          <Text style={S.sectionNumberText}>{number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={S.sectionTitle}>{title}</Text>
          <Text style={S.description}>{description}</Text>
        </View>
      </View>
      <View style={S.sectionContent}>{children}</View>
    </View>
  );
}

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={S.choice}
    >
      <View style={[S.radio, selected && S.radioSelected]}>
        {selected ? <View style={S.radioDot} /> : null}
      </View>
      <Text style={S.bodyText}>{label}</Text>
    </Pressable>
  );
}

export default function FormPlayground() {
  const [v, setV] = useState<Values>({ ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pickerType, setPickerType] = useState<"date" | "time" | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [clearable, setClearable] = useState("");
  const [autocomplete, setAutocomplete] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [step, setStep] = useState(1);
  const [extraFields, setExtraFields] = useState([""]);
  const [dragMessage, setDragMessage] = useState(
    "Drag-and-drop is available on web with a web-specific drop zone."
  );

  const update = (key: string, value: any) => {
    setV((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: "" }));
    setSubmitted(false);
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!v.firstName.trim()) {
      next.firstName = "First name is required.";
    }

    if (!v.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      next.email = "Enter a valid email address.";
    }

    if (v.password.length < 8) {
      next.password = "Password must contain at least 8 characters.";
    }

    if (v.password !== v.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!v.terms) {
      next.terms = "Accept the terms before submitting.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const output = useMemo(() => ({
    ...v,
    date: v.date.toISOString(),
    time: v.time.toISOString(),
    image: imageUri,
    files: files.map((f) => ({
      name: f.name,
      uri: f.uri,
      mimeType: f.mimeType,
      size: f.size,
    })),
    extraFields: extraFields.filter((x) => x.trim()),
  }), [v, imageUri, files, extraFields]);

  const submit = () => {
    console.log("FORM SUBMISSION ATTEMPT:", output);

    if (!validate()) {
      console.warn("FORM VALIDATION FAILED:", errors);
      Alert.alert(
        "Validation failed",
        "Correct the highlighted fields and accept the terms."
      );
      return;
    }

    setSubmitted(true);
    console.log("FORM SUBMITTED SUCCESSFULLY:", output);
    console.log("FORM JSON:", JSON.stringify(output, null, 2));

    Alert.alert(
      "Submitted",
      "The form data has been printed to the console."
    );
  };

  const reset = () => {
    setV({ ...initialValues });
    setErrors({});
    setSubmitted(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPickerType(null);
    setImageUri(null);
    setFiles([]);
    setTagDraft("");
    setClearable("");
    setAutocomplete("");
    setShowSuggestions(false);
    setStep(1);
    setExtraFields([""]);
  };

  const toggleSkill = (skill: string) => {
    const skills: string[] = v.skills;
    update(
      "skills",
      skills.includes(skill)
        ? skills.filter((x) => x !== skill)
        : [...skills, skill]
    );
  };

  const addTag = () => {
    const tag = tagDraft.trim();
    if (tag && !v.tags.includes(tag)) {
      update("tags", [...v.tags, tag]);
    }
    setTagDraft("");
  };

  const chooseImage = async (camera = false) => {
    try {
      const result = camera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
          });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        "Image picker",
        "Could not open the image picker. Check device support and permissions."
      );
    }
  };

  const chooseFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFiles((old) => [...old, ...result.assets]);
      }
    } catch {
      Alert.alert("Document picker", "Could not open the document picker.");
    }
  };

  const dateValue = pickerType ? v[pickerType] as Date : new Date();

  const changeDate = (_event: any, date?: Date) => {
    if (date && pickerType) update(pickerType, date);
    if (Platform.OS !== "ios") setPickerType(null);
  };

  const suggestions = SKILLS.filter((skill) =>
    skill.toLowerCase().includes(autocomplete.toLowerCase())
  );

  const changeExtraField = (index: number, value: string) => {
    setExtraFields((old) =>
      old.map((field, i) => i === index ? value : field)
    );
  };

  return (
    <KeyboardAvoidingView
      style={S.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={S.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* HERO */}
        <View style={S.hero}>
          <Text style={S.eyebrow}>EXPO COMPONENT CATALOG</Text>
          <Text style={S.title}>Form Playground.</Text>
          <Text style={S.heroDescription}>
            A practical catalog of form controls, with explanations,
            interactive examples, validation, and live form data.
          </Text>

          <View style={S.stats}>
            <View style={S.stat}>
              <Text style={S.statNumber}>10+</Text>
              <Text style={S.hint}>Control categories</Text>
            </View>
            <View style={S.stat}>
              <Text style={S.statNumber}>{Object.keys(v).length}</Text>
              <Text style={S.hint}>Tracked values</Text>
            </View>
            <View style={S.stat}>
              <Text style={S.statNumber}>
                {Object.values(errors).filter(Boolean).length}
              </Text>
              <Text style={S.hint}>Validation errors</Text>
            </View>
          </View>

          <Text style={S.hint}>
            All data remains local to this demo. Submitting logs values
            to the development console; it does not call a backend.
          </Text>
        </View>

        {/* 01 TEXT INPUTS */}
        <Section
          number="01"
          title="Text inputs"
          description="TextInput is React Native's main editable text control. Configure keyboard type, capitalization, length, and masking to suit the data."
        >
          <Field label="First name" required error={errors.firstName}
            description="A single-line text field. Required for successful submission.">
            <Input value={v.firstName}
              onChangeText={(x) => update("firstName", x)}
              placeholder="Jane" autoCapitalize="words" />
          </Field>

          <Field label="Last name"
            description="A standard text field for a surname.">
            <Input value={v.lastName}
              onChangeText={(x) => update("lastName", x)}
              placeholder="Doe" autoCapitalize="words" />
          </Field>

          <Field label="Username"
            description="A text field typically used for handles or account names.">
            <Input value={v.username}
              onChangeText={(x) => update("username", x)}
              placeholder="@username" />
          </Field>

          <Field label="Email address" required error={errors.email}
            description="The email keyboard includes useful characters. The submit handler checks basic email syntax.">
            <Input value={v.email}
              onChangeText={(x) => update("email", x)}
              placeholder="you@example.com"
              keyboardType="email-address" />
          </Field>

          <Field label="Password" required error={errors.password}
            description="secureTextEntry masks characters. This example adds a visibility toggle and a simple length-based indicator.">
            <View style={S.inline}>
              <View style={S.flex}>
                <Input value={v.password}
                  onChangeText={(x) => update("password", x)}
                  placeholder="At least 8 characters"
                  secureTextEntry={!showPassword} />
              </View>
              <Action label={showPassword ? "Hide" : "Show"}
                secondary onPress={() => setShowPassword(!showPassword)} />
            </View>
            <View style={S.strengthTrack}>
              <View style={[
                S.strengthFill,
                { width: `${Math.min(v.password.length / 12, 1) * 100}%` },
              ]} />
            </View>
            <Text style={S.hint}>
              {v.password.length < 8 ? "Weak" :
                v.password.length < 12 ? "Moderate length" : "Long password"}
            </Text>
          </Field>

          <Field label="Confirm password" required error={errors.confirmPassword}
            description="A second password field checks that both values match.">
            <View style={S.inline}>
              <View style={S.flex}>
                <Input value={v.confirmPassword}
                  onChangeText={(x) => update("confirmPassword", x)}
                  placeholder="Repeat password"
                  secureTextEntry={!showConfirmPassword} />
              </View>
              <Action label={showConfirmPassword ? "Hide" : "Show"}
                secondary
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} />
            </View>
          </Field>

          <Field label="Phone number"
            description="Use phone-pad to show a phone-friendly keyboard. Add country-code formatting for international numbers.">
            <Input value={v.phone}
              onChangeText={(x) => update("phone", x)}
              placeholder="+250..." keyboardType="phone-pad" />
          </Field>

          <Field label="Website / URL"
            description="A URL-friendly keyboard helps users enter web addresses. URL validation can be added separately.">
            <Input value={v.website}
              onChangeText={(x) => update("website", x)}
              placeholder="https://example.com" keyboardType="url" />
          </Field>

          <Field label="Search input"
            description="A text field that can filter a list or trigger a search. This example stores the query.">
            <Input value={v.search}
              onChangeText={(x) => update("search", x)}
              placeholder="Search..." />
          </Field>

          <Field label="Multiline textarea"
            description="Set multiline to allow longer text. Use it for bios, descriptions, and comments.">
            <Input value={v.bio}
              onChangeText={(x) => update("bio", x)}
              placeholder="Write something about yourself..."
              multiline maxLength={300} />
            <Text style={S.hint}>{v.bio.length}/300 characters</Text>
          </Field>

          <Field label="Address"
            description="A regular text input for street or postal address information.">
            <Input value={v.address}
              onChangeText={(x) => update("address", x)}
              placeholder="Street address" autoCapitalize="words" />
          </Field>

          <Field label="City"
            description="A text input for a city or locality.">
            <Input value={v.city}
              onChangeText={(x) => update("city", x)}
              placeholder="Kigali" autoCapitalize="words" />
          </Field>

          <Field label="Integer / age"
            description="number-pad helps enter whole numbers. Validate bounds before using the value in calculations.">
            <Input value={v.age}
              onChangeText={(x) => update("age", x)}
              placeholder="18" keyboardType="number-pad" />
          </Field>

          <Field label="Decimal / currency"
            description="decimal-pad provides a decimal keyboard. Format currency separately for the chosen locale.">
            <Input value={v.price}
              onChangeText={(x) => update("price", x)}
              placeholder="0.00" keyboardType="decimal-pad" />
          </Field>

          <Field label="Percentage"
            description="A numeric value usually constrained to the range 0–100.">
            <Input value={v.percentage}
              onChangeText={(x) => update("percentage", x)}
              placeholder="0–100" keyboardType="decimal-pad" />
          </Field>

          <Field label="OTP / verification code"
            description="A short numeric field commonly used for one-time verification codes.">
            <Input value={v.otp}
              onChangeText={(x) => update("otp", x)}
              placeholder="123456" keyboardType="number-pad" maxLength={6} />
          </Field>

          <Field label="Clearable input"
            description="A clear action resets the field without requiring the user to erase each character.">
            <View style={S.inline}>
              <View style={S.flex}>
                <Input value={clearable}
                  onChangeText={setClearable}
                  placeholder="Type anything..." />
              </View>
              <Action label="Clear" secondary
                onPress={() => setClearable("")} />
            </View>
          </Field>

          <Field label="Prefix and suffix example"
            description="Prefixes and suffixes provide context, such as a currency symbol or unit.">
            <View style={S.inline}>
              <View style={S.adornment}><Text style={S.bodyText}>$</Text></View>
              <View style={S.flex}>
                <Input value={v.price}
                  onChangeText={(x) => update("price", x)}
                  placeholder="0.00" keyboardType="decimal-pad" />
              </View>
              <View style={S.adornment}><Text style={S.bodyText}>USD</Text></View>
            </View>
          </Field>

          <Field label="Masked input example"
            description="A mask formats input for readability. This simple example groups a 10-digit phone number; production masks should handle editing and country-specific rules.">
            <Input
              value={v.phone}
              onChangeText={(x) => update("phone", x)}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
            <Text style={S.hint}>
              Stored as entered. Formatting is intentionally not forced in this basic example.
            </Text>
          </Field>

          <Field label="Read-only input"
            description="editable=false displays a value but prevents changes.">
            <Input value={v.readonly} editable={false} />
          </Field>

          <Field label="Disabled input"
            description="Disabled controls indicate that editing is currently unavailable.">
            <Input value={v.disabled} editable={false} />
          </Field>

          <Field label="Character-limited notes"
            description="maxLength prevents additional characters once the limit is reached.">
            <Input value={v.notes}
              onChangeText={(x) => update("notes", x)}
              placeholder="Maximum 200 characters"
              maxLength={200} multiline />
            <Text style={S.hint}>{v.notes.length}/200</Text>
          </Field>
        </Section>

        {/* 02 SELECTORS */}
        <Section
          number="02"
          title="Selection controls"
          description="Use a picker for one choice, radio buttons for a small exclusive group, checkboxes for multiple independent choices, and switches for on/off settings."
        >
          <Field label="Country picker"
            description="A native picker presents a list of options and stores the selected country.">
            <View style={S.pickerWrap}>
              <Picker selectedValue={v.country}
                onValueChange={(x) => update("country", x)}
                style={S.picker}
                dropdownIconColor={C.text}>
                {["Rwanda", "Kenya", "Uganda", "Tanzania", "Nigeria",
                  "Ghana", "United States", "United Kingdom", "India"].map((x) => (
                  <Picker.Item key={x} label={x} value={x} color="#111827" />
                ))}
              </Picker>
            </View>
          </Field>

          <Field label="Department dropdown"
            description="Use a picker when the user must select one predefined value.">
            <View style={S.pickerWrap}>
              <Picker selectedValue={v.department}
                onValueChange={(x) => update("department", x)}
                style={S.picker}>
                <Picker.Item label="Engineering" value="engineering" color="#111827" />
                <Picker.Item label="Design" value="design" color="#111827" />
                <Picker.Item label="Marketing" value="marketing" color="#111827" />
                <Picker.Item label="Sales" value="sales" color="#111827" />
              </Picker>
            </View>
          </Field>

          <Field label="Framework picker"
            description="Another single-select picker with programming framework options.">
            <View style={S.pickerWrap}>
              <Picker selectedValue={v.framework}
                onValueChange={(x) => update("framework", x)}
                style={S.picker}>
                <Picker.Item label="React" value="react" color="#111827" />
                <Picker.Item label="Vue" value="vue" color="#111827" />
                <Picker.Item label="Angular" value="angular" color="#111827" />
                <Picker.Item label="Svelte" value="svelte" color="#111827" />
              </Picker>
            </View>
          </Field>

          <Field label="Radio group: gender"
            description="Radio buttons allow exactly one selection from the group.">
            {["Female", "Male", "Non-binary", "Prefer not to say"].map((x) => (
              <Choice key={x} label={x}
                selected={v.gender === x}
                onPress={() => update("gender", x)} />
            ))}
          </Field>

          <Field label="Radio group: contact preference"
            description="The same radio pattern can be reused for different choices.">
            {["email", "phone", "sms"].map((x) => (
              <Choice key={x} label={x.toUpperCase()}
                selected={v.contactMethod === x}
                onPress={() => update("contactMethod", x)} />
            ))}
          </Field>

          <Field label="Multi-select checkbox group"
            description="Checkboxes allow several skills to be selected at once.">
            {SKILLS.map((skill) => (
              <Pressable key={skill} onPress={() => toggleSkill(skill)}
                style={S.choice}>
                <Checkbox value={v.skills.includes(skill)}
                  onValueChange={() => toggleSkill(skill)}
                  color={C.accent} />
                <Text style={S.bodyText}>{skill}</Text>
              </Pressable>
            ))}
            <Text style={S.hint}>Selected: {v.skills.join(", ") || "None"}</Text>
          </Field>

          <Field label="Segmented control"
            description="A compact button group for a small set of mutually exclusive choices.">
            <View style={S.segmented}>
              {["low", "normal", "high"].map((x) => (
                <Pressable key={x} onPress={() => update("priority", x)}
                  style={[S.segment, v.priority === x && S.segmentActive]}>
                  <Text style={[
                    S.segmentText,
                    v.priority === x && S.segmentTextActive,
                  ]}>
                    {x.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Switches / toggles"
            description="Switches represent binary settings such as notifications or marketing preferences.">
            {[
              ["newsletter", "Subscribe to newsletter"],
              ["notifications", "Enable notifications"],
              ["marketing", "Receive marketing updates"],
            ].map(([key, label]) => (
              <View key={key} style={S.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.bodyText}>{label}</Text>
                  <Text style={S.hint}>{v[key] ? "On" : "Off"}</Text>
                </View>
                <Switch value={Boolean(v[key])}
                  onValueChange={(x) => update(key, x)}
                  trackColor={{ false: "#CBD5E1", true: "#C4B5FD" }}
                  thumbColor={v[key] ? C.accent : "#FFFFFF"} />
              </View>
            ))}
          </Field>

          <Field label="Select all / clear all"
            description="Bulk actions are useful for long checkbox groups.">
            <View style={S.inline}>
              <View style={S.flex}>
                <Action label="Select all" onPress={() => update("skills", [...SKILLS])} />
              </View>
              <View style={S.flex}>
                <Action label="Clear all" secondary onPress={() => update("skills", [])} />
              </View>
            </View>
          </Field>

          <Field label="Searchable autocomplete"
            description="Type to filter suggestions. Tap an option to select it.">
            <Input value={autocomplete}
              onChangeText={(x) => {
                setAutocomplete(x);
                setShowSuggestions(true);
              }}
              placeholder="Search skills..." />
            {showSuggestions && autocomplete.length > 0
              ? suggestions.map((skill) => (
                <Pressable key={skill} style={S.suggestion}
                  onPress={() => {
                    setAutocomplete(skill);
                    setShowSuggestions(false);
                    toggleSkill(skill);
                  }}>
                  <Text style={S.bodyText}>{skill}</Text>
                  <Text style={S.hint}>Tap to select</Text>
                </Pressable>
              ))
              : null}
          </Field>

          <Field label="Chips / tag selector"
            description="Chips show selected values in a compact format. Tap a chip to remove it.">
            <View style={S.tagRow}>
              {v.skills.map((skill: string) => (
                <Pressable key={skill} style={S.tag}
                  onPress={() => toggleSkill(skill)}>
                  <Text style={S.tagText}>{skill} ×</Text>
                </Pressable>
              ))}
            </View>
          </Field>
        </Section>

        {/* 03 NUMERIC */}
        <Section
          number="03"
          title="Numeric and range controls"
          description="Use sliders for bounded numeric values, steppers for incremental changes, and rating controls for ordinal feedback."
        >
          <Field label={`Slider: ${Math.round(v.progress)}%`}
            description="A slider selects a numeric value between its minimum and maximum.">
            <Slider minimumValue={0} maximumValue={100} step={1}
              value={v.progress}
              onValueChange={(x) => update("progress", x)}
              minimumTrackTintColor={C.accent}
              maximumTrackTintColor={C.border}
              thumbTintColor={C.accent} />
          </Field>

          <Field label={`Range start: ${v.rangeStart}`}
            description="This first slider controls the lower bound of a two-value range.">
            <Slider minimumValue={0} maximumValue={100} step={1}
              value={v.rangeStart}
              onValueChange={(x) => update("rangeStart", Math.min(x, v.rangeEnd))}
              minimumTrackTintColor={C.accent}
              maximumTrackTintColor={C.border}
              thumbTintColor={C.accent} />
          </Field>

          <Field label={`Range end: ${v.rangeEnd}`}
            description="This second slider controls the upper bound. Together the sliders demonstrate a range; they are not a single two-thumb slider.">
            <Slider minimumValue={0} maximumValue={100} step={1}
              value={v.rangeEnd}
              onValueChange={(x) => update("rangeEnd", Math.max(x, v.rangeStart))}
              minimumTrackTintColor={C.green}
              maximumTrackTintColor={C.border}
              thumbTintColor={C.green} />
          </Field>

          <Field label={`Quantity stepper: ${v.quantity}`}
            description="Stepper buttons increment or decrement a numeric value.">
            <View style={S.inline}>
              <Action label="−" secondary onPress={() =>
                update("quantity", String(Math.max(0, Number(v.quantity || 0) - 1)))} />
              <View style={S.flex}>
                <Input value={v.quantity}
                  onChangeText={(x) => update("quantity", x)}
                  keyboardType="number-pad" />
              </View>
              <Action label="+" secondary onPress={() =>
                update("quantity", String(Number(v.quantity || 0) + 1))} />
            </View>
          </Field>

          <Field label={`Star rating: ${v.rating}/5`}
            description="A rating control lets users select a score. This example uses five interactive stars.">
            <View style={S.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} accessibilityRole="button"
                  accessibilityLabel={`${star} stars`}
                  onPress={() => update("rating", star)}>
                  <Text style={S.star}>{star <= v.rating ? "★" : "☆"}</Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Color picker presets"
            description="These swatches let users choose a color. A full color wheel needs a dedicated library.">
            <View style={S.colorRow}>
              {["#7C3AED", "#0891B2", "#059669", "#EA580C", "#E11D48", "#111827"].map((color) => (
                <Pressable key={color} onPress={() => update("color", color)}
                  accessibilityLabel={`Choose ${color}`}
                  style={[
                    S.colorSwatch,
                    { backgroundColor: color },
                    v.color === color && S.colorSelected,
                  ]} />
              ))}
            </View>
            <Text style={S.hint}>Selected color: {v.color}</Text>
          </Field>
        </Section>

        {/* 04 DATE AND TIME */}
        <Section
          number="04"
          title="Date and time"
          description="Native date and time pickers use the platform's standard selection UI."
        >
          <Field label="Date picker"
            description="Select a calendar date. Useful for birthdays, appointments, and deadlines.">
            <Action label={v.date.toLocaleDateString()}
              secondary onPress={() => setPickerType("date")} />
          </Field>

          <Field label="Time picker"
            description="Select a time of day independently of the date.">
            <Action label={v.time.toLocaleTimeString([], {
              hour: "2-digit", minute: "2-digit",
            })}
              secondary onPress={() => setPickerType("time")} />
          </Field>

          <Field label="Combined date and time"
            description="The combined value uses the date and time selections above. On submit, both are included in the JSON.">
            <View style={S.readonlyBox}>
              <Text style={S.bodyText}>
                {v.date.toLocaleDateString()} at {v.time.toLocaleTimeString([], {
                  hour: "2-digit", minute: "2-digit",
                })}
              </Text>
            </View>
          </Field>

          {pickerType ? (
            <View style={S.pickerCard}>
              <DateTimePicker
                value={dateValue}
                mode={pickerType}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={changeDate}
              />
              {Platform.OS === "ios" ? (
                <Action label="Done" onPress={() => setPickerType(null)} />
              ) : null}
            </View>
          ) : null}

          <Field label="Duration"
            description="A numeric duration field is useful for timers, sessions, and booking lengths.">
            <View style={S.inline}>
              <View style={S.flex}>
                <Input value={v.duration}
                  onChangeText={(x) => update("duration", x)}
                  keyboardType="number-pad" />
              </View>
              <Text style={S.bodyText}>minutes</Text>
            </View>
          </Field>
        </Section>

        {/* 05 UPLOADS */}
        <Section
          number="05"
          title="Files and media"
          description="Image and document pickers use Expo modules. The returned URIs reference local assets and are not public download URLs."
        >
          <View style={S.inline}>
            <View style={S.flex}>
              <Action label="Choose image" onPress={() => chooseImage(false)} />
            </View>
            <View style={S.flex}>
              <Action label="Open camera" secondary onPress={() => chooseImage(true)} />
            </View>
          </View>

          <Field label="Image preview"
            description="The selected image appears here and its local URI is included in the JSON preview.">
            {imageUri ? (
              <View style={S.uploadCard}>
                <Image source={{ uri: imageUri }} style={S.previewImage} />
                <Action label="Remove image" secondary onPress={() => setImageUri(null)} />
              </View>
            ) : (
              <View style={S.emptyState}>
                <Text style={S.bodyText}>No image selected</Text>
                <Text style={S.hint}>Choose an image or use the camera.</Text>
              </View>
            )}
          </Field>

          <Action label="Choose documents" onPress={chooseFiles} />

          <Field label="Selected documents"
            description="Multiple documents can be selected. Remove any item before submitting.">
            {files.length === 0 ? (
              <Text style={S.hint}>No documents selected.</Text>
            ) : files.map((file, index) => (
              <View key={`${file.uri}-${index}`} style={S.fileRow}>
                <View style={S.flex}>
                  <Text style={S.bodyText}>{file.name}</Text>
                  <Text style={S.hint}>
                    {file.size != null
                      ? `${Math.round(file.size / 1024)} KB`
                      : "File size unavailable"}
                  </Text>
                </View>
                <Pressable onPress={() =>
                  setFiles((old) => old.filter((_, i) => i !== index))}>
                  <Text style={S.error}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </Field>

          <Field label="Drag-and-drop upload"
            description="React Native does not provide a cross-platform drag-and-drop form control. A web implementation needs a drop-zone component and platform-specific file handling.">
            <View style={S.emptyState}>
              <Text style={S.bodyText}>File drop zone placeholder</Text>
              <Text style={S.hint}>{dragMessage}</Text>
              <Action label="Dismiss explanation" secondary
                onPress={() => setDragMessage("Add a web-specific drop-zone library to implement drag-and-drop.")} />
            </View>
          </Field>
        </Section>

        {/* 06 SPECIALIZED */}
        <Section
          number="06"
          title="Specialized inputs"
          description="Some form controls require a dedicated library or a platform-specific implementation. These examples distinguish working inputs from planned extensions."
        >
          <Field label="Tags input"
            description="Enter a tag and press Add. Tap any existing tag to remove it.">
            <View style={S.inline}>
              <View style={S.flex}>
                <Input value={tagDraft}
                  onChangeText={setTagDraft}
                  placeholder="Type a tag..." />
              </View>
              <Action label="Add" onPress={addTag} />
            </View>
            <View style={S.tagRow}>
              {v.tags.map((tag: string) => (
                <Pressable key={tag} style={S.tag}
                  onPress={() => update("tags", v.tags.filter((x: string) => x !== tag))}>
                  <Text style={S.tagText}>{tag} ×</Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Location / coordinates"
            description="Coordinates can be entered as text. Automatic GPS location requires a location-permission flow and an Expo location module.">
            <Input value={v.coordinates}
              onChangeText={(x) => update("coordinates", x)}
              placeholder="Latitude, longitude" />
          </Field>

          <Field label="International phone input"
            description="This basic example stores the phone number. A production country-code dropdown and international formatting need a dedicated phone-input library.">
            <View style={S.inline}>
              <View style={[S.adornment, { minWidth: 64 }]}>
                <Text style={S.bodyText}>+250</Text>
              </View>
              <View style={S.flex}>
                <Input value={v.phone}
                  onChangeText={(x) => update("phone", x)}
                  placeholder="Phone number" keyboardType="phone-pad" />
              </View>
            </View>
          </Field>

          <Field label="Credit card number"
            description="Demo field only. Never log real payment-card data. Production payments should use a PCI-compliant payment provider and tokenized card fields.">
            <Input value={v.creditCard}
              onChangeText={(x) => update("creditCard", x)}
              placeholder="Card number" keyboardType="number-pad"
              maxLength={19} />
          </Field>

          <View style={S.inline}>
            <View style={S.flex}>
              <Field label="Card expiry"
                description="Month and year.">
                <Input value={v.cardExpiry}
                  onChangeText={(x) => update("cardExpiry", x)}
                  placeholder="MM/YY" maxLength={5} />
              </Field>
            </View>
            <View style={S.flex}>
              <Field label="CVV"
                description="Sensitive security code.">
                <Input value={v.cardCvv}
                  onChangeText={(x) => update("cardCvv", x)}
                  placeholder="CVV" keyboardType="number-pad" maxLength={4} />
              </Field>
            </View>
          </View>

          <Field label="Captcha placeholder"
            description="Real CAPTCHA requires a verification service. This text field is only a UI example and does not provide bot protection.">
            <Input value={v.captcha}
              onChangeText={(x) => update("captcha", x)}
              placeholder="Enter demo verification text" />
          </Field>

          <Field label="Markdown editor"
            description="A multiline text field can store Markdown source. Live formatting and preview require an editor or Markdown renderer library.">
            <Input value={v.markdown}
              onChangeText={(x) => update("markdown", x)}
              placeholder={"# Heading\n**Bold text**"}
              multiline />
          </Field>

          <Field label="Signature pad"
            description="A working signature pad requires a drawing canvas, stroke handling, and image export. This catalog does not pretend a text input is a signature capture.">
            <View style={S.emptyState}>
              <Text style={S.bodyText}>Signature canvas not installed</Text>
              <Text style={S.hint}>
                Add a compatible signature canvas library to capture strokes.
              </Text>
            </View>
          </Field>

          <Field label="Rich-text editor"
            description="Rich-text editing supports formatted paragraphs, links, lists, and other document structures. A dedicated editor library is required.">
            <View style={S.emptyState}>
              <Text style={S.bodyText}>Rich-text editor not installed</Text>
              <Text style={S.hint}>
                The Markdown source field above is a simpler alternative.
              </Text>
            </View>
          </Field>

          <Field label="Emoji picker"
            description="A dedicated emoji picker adds search and categorized emoji selection. The native keyboard can also provide emoji input.">
            <Text style={S.bodyText}>😀 🎨 🚀 🌍 ⭐</Text>
            <Text style={S.hint}>
              Emoji selection here is illustrative, not a full searchable picker.
            </Text>
          </Field>
        </Section>

        {/* 07 DYNAMIC FORMS */}
        <Section
          number="07"
          title="Dynamic and conditional fields"
          description="Forms can add or remove fields, show dependent controls, and reveal extra inputs based on a user's selection."
        >
          <Field label="Dynamic field array"
            description="Add and remove repeatable fields, such as extra contact details or list items.">
            {extraFields.map((field, index) => (
              <View key={index} style={S.inline}>
                <View style={S.flex}>
                  <Input value={field}
                    onChangeText={(x) => changeExtraField(index, x)}
                    placeholder={`Extra field ${index + 1}`} />
                </View>
                <Action label="Remove" secondary onPress={() =>
                  setExtraFields((old) => old.filter((_, i) => i !== index))} />
              </View>
            ))}
            <Action label="Add field" onPress={() => setExtraFields((old) => [...old, ""])} />
          </Field>

          <Field label="Conditional fields"
            description="This field appears only when the user enables marketing updates.">
            <View style={S.toggleRow}>
              <Text style={S.bodyText}>Receive marketing updates</Text>
              <Switch value={v.marketing}
                onValueChange={(x) => update("marketing", x)}
                trackColor={{ false: "#CBD5E1", true: "#C4B5FD" }}
                thumbColor={v.marketing ? C.accent : "#FFFFFF"} />
            </View>
            {v.marketing ? (
              <View style={S.conditionalBox}>
                <Text style={S.bodyText}>Marketing preferences</Text>
                <Text style={S.description}>
                  This section is visible because marketing updates are enabled.
                </Text>
                <Choice label="Email updates"
                  selected={v.contactMethod === "email"}
                  onPress={() => update("contactMethod", "email")} />
                <Choice label="SMS updates"
                  selected={v.contactMethod === "sms"}
                  onPress={() => update("contactMethod", "sms")} />
              </View>
            ) : null}
          </Field>

          <Field label="Dependent dropdown example"
            description="A production dependent dropdown filters the second list based on the first selection. This example demonstrates a framework-dependent selection.">
            <Text style={S.bodyText}>Selected framework: {v.framework}</Text>
            <View style={S.pickerWrap}>
              <Picker selectedValue={v.framework}
                onValueChange={(x) => update("framework", x)}
                style={S.picker}>
                <Picker.Item label="React" value="react" color="#111827" />
                <Picker.Item label="Vue" value="vue" color="#111827" />
                <Picker.Item label="Angular" value="angular" color="#111827" />
                <Picker.Item label="Svelte" value="svelte" color="#111827" />
              </Picker>
            </View>
            <Text style={S.hint}>
              Use the selected value to filter another picker when adding real dependent options.
            </Text>
          </Field>
        </Section>

        {/* 08 MULTI-STEP */}
        <Section
          number="08"
          title="Multi-step form demo"
          description="A multi-step form divides a long form into smaller stages. This example demonstrates step navigation; the complete data still lives in the same state object."
        >
          <View style={S.stepIndicator}>
            {[1, 2, 3].map((n) => (
              <Pressable key={n} onPress={() => setStep(n)}
                style={[S.stepCircle, step === n && S.stepCircleActive]}>
                <Text style={[S.stepText, step === n && S.stepTextActive]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={S.bodyText}>Step {step} of 3</Text>
          <Text style={S.description}>
            {step === 1 ? "Step 1: Personal details" :
              step === 2 ? "Step 2: Preferences" :
                "Step 3: Review and submit"}
          </Text>
          <View style={S.inline}>
            <View style={S.flex}>
              <Action label="Previous" secondary disabled={step === 1}
                onPress={() => setStep((x) => Math.max(1, x - 1))} />
            </View>
            <View style={S.flex}>
              <Action label={step === 3 ? "Submit form" : "Next step"}
                onPress={() => step === 3 ? submit() : setStep((x) => Math.min(3, x + 1))} />
            </View>
          </View>
        </Section>

        {/* 09 VALIDATION */}
        <Section
          number="09"
          title="Validation and form actions"
          description="Validation checks whether the supplied data meets the form's rules. Inline errors explain what needs to be corrected."
        >
          <Field label="Terms and conditions" required error={errors.terms}
            description="This checkbox is required before a successful submission.">
            <Pressable style={S.choice}
              onPress={() => update("terms", !v.terms)}>
              <Checkbox value={v.terms}
                onValueChange={(x) => update("terms", x)}
                color={C.accent} />
              <Text style={S.bodyText}>I accept the terms and conditions</Text>
            </Pressable>
          </Field>

          {Object.values(errors).filter(Boolean).length > 0 ? (
            <View style={S.errorBox}>
              <Text style={S.error}>
                {Object.values(errors).filter(Boolean).length} validation error(s)
              </Text>
              {Object.entries(errors).filter(([, message]) => Boolean(message))
                .map(([key, message]) => (
                  <Text key={key} style={S.error}>
                    • {key}: {message}
                  </Text>
                ))}
            </View>
          ) : null}

          {submitted ? (
            <View style={S.successBox}>
              <Text style={S.success}>
                Submission succeeded. Check your console for the form data.
              </Text>
            </View>
          ) : null}

          <View style={S.inline}>
            <View style={S.flex}>
              <Action label="Submit form" onPress={submit} />
            </View>
            <View style={S.flex}>
              <Action label="Reset all" secondary onPress={reset} />
            </View>
          </View>

          <Text style={S.hint}>
            Other production validation patterns include minimum and maximum
            values, async username checks, cross-field rules, server-side
            validation, touched/dirty state, and loading indicators.
          </Text>
        </Section>

        {/* 10 JSON */}
        <Section
          number="10"
          title="Live form data"
          description="This preview serializes the current state into JSON. It is useful for understanding the data shape that a submit handler receives."
        >
          <View style={S.jsonPanel}>
            <Text selectable style={S.jsonText}>
              {JSON.stringify(output, null, 2)}
            </Text>
          </View>
          <Action label="Log current JSON" onPress={() => {
            console.log("CURRENT FORM JSON:", JSON.stringify(output, null, 2));
            Alert.alert("Logged", "Current JSON printed to the console.");
          }} />
        </Section>

        <Text style={S.footer}>
          FORM PLAYGROUND · EXPO · REACT NATIVE
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  container: {
    padding: 18,
    paddingBottom: 64,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    gap: 18,
  },
  hero: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    padding: 24,
    gap: 14,
  },
  eyebrow: {
    color: C.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: C.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.3,
  },
  heroDescription: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 23,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 28,
    paddingVertical: 8,
  },
  stat: { gap: 4 },
  statNumber: {
    fontSize: 23,
    fontWeight: "800",
    color: C.text,
  },
  section: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 18,
    gap: 18,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sectionNumber: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumberText: {
    color: C.accent,
    fontWeight: "800",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: C.text,
    marginBottom: 5,
  },
  sectionContent: { gap: 22 },
  field: { gap: 8 },
  label: {
    color: C.text,
    fontSize: 13,
    fontWeight: "700",
  },
  description: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  hint: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  bodyText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 19,
  },
  error: {
    color: C.red,
    fontSize: 12,
    lineHeight: 18,
  },
  success: {
    color: C.green,
    fontSize: 13,
    lineHeight: 19,
  },
  input: {
    color: C.text,
    backgroundColor: C.field,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === "ios" ? 13 : 11,
    fontSize: 14,
    minHeight: 46,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  disabled: {
    opacity: 0.55,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  button: {
    minHeight: 44,
    backgroundColor: C.accent,
    borderWidth: 1,
    borderColor: C.accent,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderColor: C.border,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  strengthTrack: {
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  strengthFill: {
    height: 5,
    backgroundColor: C.green,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    overflow: "hidden",
    backgroundColor: C.field,
  },
  picker: {
    color: C.text,
    height: 52,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
  },
  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: C.accent,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.accent,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 5,
  },
  segmented: {
    flexDirection: "row",
    gap: 4,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.field,
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 11,
  },
  segmentActive: {
    backgroundColor: C.accent,
  },
  segmentText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  stars: {
    flexDirection: "row",
    gap: 12,
  },
  star: {
    color: "#D97706",
    fontSize: 32,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorSwatch: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSelected: {
    borderColor: "#111827",
    transform: [{ scale: 1.08 }],
  },
  adornment: {
    minHeight: 44,
    minWidth: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#FFFFFF",
  },
  pickerCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  readonlyBox: {
    backgroundColor: C.field,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 13,
  },
  uploadCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 9,
    resizeMode: "contain",
  },
  emptyState: {
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    padding: 16,
    gap: 8,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderColor: C.border,
    paddingVertical: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#DDD6FE",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  tagText: {
    color: "#5B21B6",
    fontSize: 12,
    fontWeight: "600",
  },
  suggestion: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 9,
    padding: 12,
    gap: 4,
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFF1F2",
    gap: 5,
  },
  successBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  jsonPanel: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
  },
  jsonText: {
    color: "#166534",
    fontSize: 11,
    lineHeight: 17,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  conditionalBox: {
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    gap: 10,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  stepText: {
    color: C.muted,
    fontWeight: "700",
  },
  stepTextActive: {
    color: "#FFFFFF",
  },
  footer: {
    color: C.muted,
    fontSize: 10,
    textAlign: "center",
    letterSpacing: 1.3,
    paddingVertical: 12,
  },
});
