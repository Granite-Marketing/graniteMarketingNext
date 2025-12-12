"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { BiEnvelope, BiMap, BiPhone } from "react-icons/bi";

export function ContactForm() {
  return (
    <section id="contact" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container grid grid-cols-1 items-start gap-y-12 md:grid-flow-row md:grid-cols-2 md:gap-x-12 lg:grid-flow-col lg:gap-x-20 lg:gap-y-16">
        <div>
          <header className="mb-6 md:mb-8">
            <p className="mb-3 font-semibold md:mb-4">Send</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Your message
            </h2>
            <p className="md:text-md">
              Fill in the details below and we'll respond quickly
            </p>
          </header>
          <address className="grid grid-cols-1 gap-4 py-2 not-italic">
            <div className="flex items-center gap-4">
              <BiEnvelope className="size-6 flex-none" />
              <a href="mailto:hello@granitemarketing.com">hello@granitemarketing.com</a>
            </div>
            <div className="flex items-center gap-4">
              <BiPhone className="size-6 flex-none" />
              <a href="tel:+44201234">+44 (0) 20 1234</a>
            </div>
            <div className="flex items-center gap-4">
              <BiMap className="size-6 flex-none" />
              <p>Unit 5, 42 Brick Lane, London E1 6RF</p>
            </div>
          </address>
        </div>
        <form className="grid max-w-lg grid-cols-1 grid-rows-[auto_auto] gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="grid w-full items-center">
              <Label htmlFor="firstName" className="mb-2">
                First name
              </Label>
              <Input type="text" id="firstName" name="firstName" required />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="lastName" className="mb-2">
                Last name
              </Label>
              <Input type="text" id="lastName" name="lastName" required />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid w-full items-center">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div className="grid w-full items-center">
              <Label htmlFor="phone" className="mb-2">
                Phone number
              </Label>
              <Input type="tel" id="phone" name="phone" />
            </div>
          </div>
          <div className="grid w-full items-center">
            <Label className="mb-2">What's your inquiry about</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select one..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workflow-optimization">Workflow optimization</SelectItem>
                <SelectItem value="new-automation">New automation build</SelectItem>
                <SelectItem value="integration-support">Integration support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center py-3 md:py-4">
            <Label className="mb-3 md:mb-4">
              What describes your situation
            </Label>
            <RadioGroup className="grid grid-cols-2 gap-x-6 gap-y-3.5">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="workflow-optimization" id="first_choice" />
                <Label htmlFor="first_choice">Workflow optimization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new-automation" id="second_choice" />
                <Label htmlFor="second_choice">New automation build</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="integration-support" id="third_choice" />
                <Label htmlFor="third_choice">Integration support</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical-consultation" id="fourth_choice" />
                <Label htmlFor="fourth_choice">Technical consultation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general-inquiry" id="fifth_choice" />
                <Label htmlFor="fifth_choice">General inquiry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid w-full items-center">
            <Label htmlFor="message" className="mb-2">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your project..."
              className="min-h-[11.25rem] overflow-auto"
              required
            />
          </div>
          <div className="mb-3 flex items-center space-x-2 text-sm md:mb-4">
            <Checkbox id="terms" name="terms" required />
            <Label htmlFor="terms" className="cursor-pointer">
              I agree to the terms
            </Label>
          </div>
          <div>
            <Button type="submit" title="Send">
              Send
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
